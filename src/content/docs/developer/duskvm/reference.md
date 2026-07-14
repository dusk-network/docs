---
title: DuskVM contract reference
description: The contract, state, ABI, serialization, event, build, and deployment model for DuskVM contracts.
---

DuskVM contracts are `no_std` Rust libraries compiled to `wasm32-unknown-unknown`. Forge's `#[dusk_forge::contract]` macro turns an annotated module into the exports expected by DuskVM.

## Contract shape

```rust
#![no_std]
#![cfg(target_family = "wasm")]

#[dusk_forge::contract]
mod counter {
    pub struct Counter {
        value: u64,
    }

    impl Counter {
        pub const fn new() -> Self {
            Self { value: 0 }
        }

        pub fn get(&self) -> u64 {
            self.value
        }

        pub fn set(&mut self, value: u64) {
            self.value = value;
        }
    }
}
```

The macro expects one public state struct and a parameterless `const fn new()` returning that struct. Forge's generated template makes this constructor public.

| Rust item | Contract behavior |
|---|---|
| `const fn new() -> Self` | Required constructor for initial state; not a callable entrypoint |
| Public inherent method | Exported as a contract entrypoint |
| Private method | Internal helper; not exported |
| `pub fn init(&mut self, ...)` | Optional deployment initializer, encoded through `--init-args` |
| Trait method | Exported only when named in `#[contract(expose = [...])]` on its trait implementation |

Multiple method parameters are encoded as a tuple. For example, `(to: Address, amount: u64)` has the input type `(Address, u64)`. Methods without parameters use `()`.

## State and failure

DuskVM persists a contract's WASM memory between successful calls. Forge keeps the annotated state struct in that memory, so contract state can be modeled with ordinary `no_std` Rust types such as structs, enums, `Vec`, `BTreeMap`, and `BTreeSet`.

A failed call does not commit its state changes. Contract code must still validate every input, caller, authorization condition, arithmetic operation, and cross-contract result.

Keep `overflow-checks = true` in the release profile. Forge includes this setting in generated projects and `dusk-forge check` validates it.

## ABI and serialization

DuskVM entrypoints exchange bytes through the Dusk contract ABI. Forge generates the low-level exports and serializes method inputs and outputs with [`rkyv`](https://rkyv.org/).

Use these commands instead of constructing bytes by hand:

| Command | Purpose |
|---|---|
| `dusk-forge schema --pretty` | Show callable methods, input and output types, and registered events |
| `dusk-forge call <METHOD> --input '<JSON>'` | Encode readable input through the data driver |
| `dusk-forge verify` | Validate built WASM artifacts and inspect the contract hash and schema |

Rusk Wallet expects `--fn-args` as hex without a `0x` prefix. For a method whose input is `()`, pass `--fn-args ''`.

## Contract and data-driver builds

Forge compiles the same source into two artifacts using mutually exclusive contract and data-driver features:

| Build | Runs | Purpose |
|---|---|---|
| `contract` | On-chain in DuskVM | Contract logic and persisted state |
| `data-driver` | Off-chain | Schema and JSON-to-`rkyv` encoding and decoding |

Forge projects can expose this second build through either a `data-driver` or `data-driver-js` Cargo feature. The generated template uses `data-driver-js`, which extends the data-driver feature with allocator exports for browser tooling.

The data driver lets wallets, explorers, and SDKs work with readable values without duplicating a contract's binary encoding. It is not deployed as the on-chain contract artifact.

An application can load the data-driver WASM directly. To make JSON encoding and decoding available through a Rusk node's contract routes, the contract owner can register the driver with that node:

```bash
rusk-wallet --network testnet driver-deploy \
  --code target/data-driver/wasm32-unknown-unknown/release/<CONTRACT_NAME>.wasm \
  --contract-id <CONTRACT_ID>
```

The command signs the driver with owner profile `0` by default. Pass `--profile-idx <INDEX>` when the contract was deployed by another wallet profile.

## Events

`dusk_core::abi::emit(topic, value)` emits an event during execution. Emission alone does not add an event to the Forge schema.

For an event to be described and decoded by the generated data driver:

1. Define a serializable event type.
2. Implement `dusk_forge::ContractEvent` with its topic or topics.
3. Register the type on the module with `#[dusk_forge::contract(events = [EventType])]`.
4. Emit the registered type with one of its declared topics.

This explicit registration keeps the schema and event decoder tied to concrete data types. Forge rejects emitted event values whose unregistered type it can determine at compile time. Without registration, the generated schema and data driver have no event entry or decoder.

## Deployment identity

Rusk derives a contract ID from the contract bytecode, deployment nonce, and deployer's public key. Reusing all three inputs produces the same ID, so use a new nonce when deploying the same bytecode from the same account.

If a contract exposes `init`, deployment invokes it after creating the initial state. Encode any initializer arguments before passing them to `rusk-wallet contract-deploy --init-args`; omit `--init-args` only when `init` takes no arguments or the contract has no initializer.

`init` remains an exported entrypoint after deployment. If it must run only once, record that state and reject later calls; enforce any required caller authorization in the contract as well.

Both deployment and contract calls submitted as transactions consume gas, whether or not the called method changes state. Test the compiled WASM, verify the exact artifact, and deploy to testnet before using mainnet funds.

## References

- [Forge source and releases](https://github.com/dusk-network/forge)
- [DuskVM source](https://github.com/dusk-network/rusk/tree/master/vm)
- [Dusk contract ABI](https://docs.rs/dusk-core/latest/dusk_core/abi/)
- [Rusk Wallet](/use/wallets/#rusk-wallet)
- [Dusk Connect](/developer/integrations/dusk-connect/)
- [W3sper SDK](/developer/integrations/w3sper/)
