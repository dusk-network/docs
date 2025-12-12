---
title: Smart Contracts on DuskDS
description: Overview of DuskDS smart contracts, core concepts, and the my-first-contract example.
---

> This page is for **advanced builders** who want to write Rust/WASM smart contracts directly on **DuskDS**, the settlement and data layer.  
> For most dApps, you should deploy on [DuskEVM](/developer/smart-contracts-dusk-evm/deploy-on-evm) and use DuskDS indirectly.

Smart contracts on DuskDS are used for low‑level protocol logic and specialised applications that need direct access to the settlement layer. If you just want to build a “normal” DeFi, NFT or application contract, prefer DuskEVM.

## Canonical Example

The [`my-first-contract`](https://github.com/dusk-network/my-first-contract) repository is the canonical example of a DuskDS contract.

To build, deploy and interact with this contract, follow the README in the repo.

## Prerequisites

To develop DuskDS contracts you need:

- a recent Rust toolchain with the `wasm32-unknown-unknown` target;
- the tools and versions listed in the [Rusk README](https://github.com/dusk-network/rusk/blob/master/README.md);
- a Rust‑capable editor (VS Code + Rust Analyzer, RustRover, Vim + Rust Analyzer, etc.).

We intentionally do not duplicate exact versions here; always refer to the Rusk README for the up‑to‑date list.

## Deploying

To simplify smart contract deployment, we provide built-in functionality within the [Rusk Wallet](https://github.com/dusk-network/rusk/tree/master/rusk-wallet/src/bin). Follow the [Rusk Wallet README](https://github.com/dusk-network/rusk/blob/master/rusk-wallet/src/bin/README.md#installation) to install a local instance.

### Deployment Command

Use the following command to deploy a contract:

```bash
rusk-wallet contract-deploy \
  --code <PATH_TO_WASM_CONTRACT> \
  --init-args <INITIALIZATION_ARGUMENTS> \
  --deploy-nonce <DEPLOY_NONCE> \
  [--address <DEPLOYER_ADDRESS>] \
  [--gas-limit <GAS_LIMIT>] \
  [--gas-price <GAS_PRICE>]
```

The `deploy_nonce` should be a unique number for the deployer’s wallet. It distinguishes the deployment from other deployments of the same contract (code) made by the same wallet. If the same deployer deploys the same contract again, a different nonce must be used.

If different wallets deploy the same contract with the same nonce, the resulting contract addresses will still be unique because they are determined by combining the contract's bytecode, the deploy nonce, and the deployer’s public key.

### Deployment fee

The gas fees related to the contract deployment are proportional to the number of bytes of the contract's bytecode:

`Total Cost=Bytecode Length × GAS_PER_DEPLOY_BYTE × Current Gas Price`

Since a deployment may execute some contract initialization code, that code will also be metered and executed with the given `gas_limit`.

## Contract Model

A DuskDS smart contract is:

- a `no_std` Rust crate compiled to WASM (`wasm32-unknown-unknown`);
- running inside the Dusk VM as part of DuskDS;
- with a small, fixed ABI surface exposed via `dusk-core` host functions;
- whose entire linear memory is persisted between successful calls.

Conceptually:

- You write Rust code that manipulates a state struct.
- Entry functions (exposed with `#[no_mangle]`) decode inputs, call your Rust logic, and encode outputs.
- The runtime takes care of persisting memory and enforcing gas / execution limits.

### State & Persistence

Unlike EVM‑style key–value storage, DuskDS contracts treat the WASM linear memory as the contract state:

- A static state object (e.g. `static mut STATE: MyState`) holds your data.
- On each call, the runtime loads the persisted memory, your code updates it, and the runtime writes it back if the call succeeds.
- If a call panics or fails, the state is reverted to its previous version.

Practically this means:

- You can model state as ordinary Rust structs, collections, and enums.
- You must be careful about initialization: provide an `init` or similar function to set up state at deployment.

### Common Structure

Contracts are compiled with `#![no_std]`. They:

- link against `core` and optionally `alloc`;
- cannot use OS features, threads, the standard library, or dynamic allocation patterns that assume a host OS.

Common patterns:

- Use [`BTreeMap`](https://doc.rust-lang.org/alloc/collections/btree_map/struct.BTreeMap.html) instead of `HashMap`.
- Use [`BTreeSet`](https://doc.rust-lang.org/alloc/collections/btree_set/struct.BTreeSet.html) instead of `HashSet`.

Typical crate imports:

```rust
#![no_std]

extern crate alloc;

use core::fmt;
use alloc::{vec::Vec, string::String};
```

### Contract Methods

Entry functions are exposed to the VM as `#[no_mangle]` functions with a fixed signature:

```rust
#[no_mangle]
unsafe fn increment(arg_len: u32) -> u32 {
    wrap_call(arg_len, |_: ()| STATE.increment())
}
```

Patterns to remember:

- `wrap_call` from `dusk_core::abi` decodes the input payload into a Rust type and encodes the return value.
- Each entrypoint accepts a single byte slice and returns a single byte slice; the generic type in the closure is how you work with structured data.
- All errors should be surfaced as `Result` values and mapped into the ABI; panicking will revert the state and abort the call.

### Host Functions

Contracts call back into the host via `dusk-core`:

- reading and writing contract memory;
- accessing environment data (e.g. block height, timestamps, caller context, public sender);
- emitting events;
- performing cryptographic operations (hashing, verification);
- interacting with the transaction model.

For the full list of host functions and their signatures, refer to the [dusk-core crate documentation](https://docs.rs/dusk-core/latest/dusk_core/abi/index.html) and the `rusk` repository.

### Serialization and Data Drivers

On the wire, contract arguments and return values are encoded in a compact binary format. DuskDS uses [`rkyv`](https://github.com/rkyv/rkyv) for zero‑copy serialization.

A common pattern is to provide a **data driver** crate:

- a small WASM module that implements `ConvertibleContract` from `dusk-data-driver`;
- describes your functions and events in terms of JSON‑friendly types;
- knows how to encode JSON ↔ RKYV for each call and event.

Off‑chain applications (frontends, indexers, services) then:

- talk JSON to the data driver;
- let the data driver handle the binary encoding expected by the on‑chain contract.

## Testing and debugging

Because contracts are Rust crates, you can:

- write unit and integration tests with `#[test]` and `cargo test`;
- use conventional Rust testing patterns for pure logic;
- mock or abstract host functions where necessary.

For debugging:

- start by checking panic messages, error codes, and logs exposed by the node;
- ensure your toolchain and dependencies match what the `rusk` README expects;
- confirm that your WASM build target and flags match those used in the official examples.

If a call consistently fails once deployed, try to reproduce the failure in a smaller unit test with the same inputs and state.

## Multisig patterns (high level)

Dusk supports multisig patterns in both transaction models:

- **Moonlight** (public, account‑based) contracts can implement standard multisig schemes:  
  multiple keys sign a transaction; the contract enforces thresholds and manages balances.
- **Phoenix** (shielded) multisig is more involved because of the privacy and cryptographic requirements; it typically requires more advanced protocols and careful design.

For a concrete Moonlight multisig implementation, see the  
[`multisig-contract` repository](https://github.com/dusk-network/multisig-contract).

## Cheatsheet

Collection of code snippets and information bits on smart contract development for Dusk.

### Common Data Structures

> Because we program for WASM in no-std some data structures are not available. Here is a list of common alternatives:

| Example                                                                                        | Explanation                                                                           |
| ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| [BTreeMap](https://doc.rust-lang.org/nightly/alloc/collections/btree_map/struct.BTreeMap.html) | Alternative to HashMap in a no-std env |
| [BTreeSet](https://doc.rust-lang.org/beta/alloc/collections/btree_set/struct.BTreeSet.html)    | Alternative to HashSet in a no-std env |

:::tip[BTree Information]
Data structures based on B-Trees require the Ord trait to be implemented for the values which get inserted. (In the case of a Map, the Ord needs to be implemented on the Key)
:::

### Common host functions

| Function                                 | Explanation           |
| ---------------------------------------- | --------------------- |
| dusk_core::abi::emit("EVENT_NAME", data) | Emit a contract event |

### Common Dependencies

- dusk-core, with `ABI` feature enabled

#### No-std Crates

- core
- alloc

The alloc crate needs to explicitly be imported in order to use heap-allocated values in a #![no-std] environment.
More information on the alloc crate can be found <a href="https://doc.rust-lang.org/alloc/" target="_blank">here</a>.

### Simple Contract Template

[Counter Contract](https://github.com/dusk-network/my-first-contract)

### Example Makefile to compile to WASM

```bash
build: ## Build contract
	@RUSTFLAGS="-C link-args=-zstack-size=65536" \
	cargo build \
	  --release \
	  --manifest-path=Cargo.toml \
	  --color=always \
	  -Z build-std=core,alloc \
	  --target wasm32-unknown-unknown
	@mkdir -p target/stripped
	@find target/wasm32-unknown-unknown/release -maxdepth 1 -name "*.wasm" \
	    | xargs -I % basename % \
	    | xargs -I % wasm-tools strip -a \
	 	          target/wasm32-unknown-unknown/release/% \
	 	          -o target/stripped/%

# test: contract ## Run all tests
#	@cargo test \
#	  --manifest-path=Cargo.toml \
#	  --color=always

MAX_COUNTER_CONTRACT_SIZE = 8192

.PHONY: contract test
```

### More references

The <a href="https://cheats.rs/" target="_blank">Rust Language Cheat Sheet</a> is another great cheat sheet that can be used as a reference for Rust code. 

Note: Not all examples apply due to our no-std constraints.

## FAQ

A few common questions about DuskDS contracts:

**Can a contract deploy another contract?**  
Not yet. Contracts cannot currently deploy other contracts on DuskDS.

**How do I pause or lock a contract?**  
Contract “locking” / pause behaviour is implemented at the contract level. A typical pattern is to keep an `is_paused` flag and an owner/admin key in state, and guard sensitive entrypoints with checks on those fields.

**How do I verify a contract build?**  
Use the verifiable build flow described in the [Deterministic Build README](https://github.com/dusk-network/dev-tools/tree/main/deterministic-build) (reproduce the build with the same Docker image / toolchain and compare hashes).
