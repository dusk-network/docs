---
title: Smart Contracts on DuskDS
description: Build Rust/WASM smart contracts on DuskDS using the Forge framework.
---

Dusk offers two paths for smart contract development:

- **DuskDS** (this page) - Rust/WASM contracts on Dusk's native settlement layer with access to privacy features and the full power of Rust's ecosystem
- **[DuskEVM](/developer/smart-contracts-dusk-evm/deploy-on-evm)** - An Optimism-based EVM application layer for Solidity/Vyper contracts using familiar tooling (Hardhat, Foundry)

Choose DuskDS for native integration with Dusk's privacy and settlement features. Choose DuskEVM for rapid prototyping or when porting existing Solidity contracts.

## Quick Start

### 1. Clone the Template

The [`my-first-contract`](https://github.com/dusk-network/my-first-contract) repository is the canonical starting point:

```bash
git clone https://github.com/dusk-network/my-first-contract
cd my-first-contract
```

### 2. Build and Test

```bash
make wasm      # Build optimized contract WASM
make wasm-dd   # Build data-driver WASM
make test      # Build and run tests
```

The contract WASM will be at `target/contract/wasm32-unknown-unknown/release/my_first_contract.wasm`

### 3. Project Structure

```
my-first-contract/
├── Cargo.toml              # Workspace configuration
├── Makefile                # Build orchestration
├── rust-toolchain.toml     # Pinned Rust version
└── contract/
    ├── Cargo.toml          # Contract dependencies
    ├── Makefile            # Contract build targets
    └── src/lib.rs          # Contract implementation
```

## Prerequisites

To develop DuskDS contracts you need:

- Rust nightly toolchain with the `wasm32-unknown-unknown` target
- `jq` for parsing cargo metadata
- `wasm-opt` (optional, for smaller binaries - install via [binaryen](https://github.com/WebAssembly/binaryen))
- A Rust-capable editor (VS Code + Rust Analyzer, RustRover, etc.)

For exact toolchain versions, refer to the [Rusk README](https://github.com/dusk-network/rusk/blob/master/README.md) or the `rust-toolchain.toml` in [`my-first-contract`](https://github.com/dusk-network/my-first-contract).

## Contract Development with Forge

[Forge](https://github.com/dusk-network/forge) is a procedural macro framework that eliminates boilerplate in DuskDS contract development. The `#[contract]` macro automatically generates WASM exports, schemas, and data-driver implementations from a single annotated module.

For comprehensive documentation on Forge, see the [Forge README](https://github.com/dusk-network/forge/blob/main/README.md).

### Basic Contract Structure

```rust
#![no_std]
#![cfg(target_family = "wasm")]

extern crate alloc;

#[dusk_forge::contract]
mod counter {
    /// Contract state.
    pub struct Counter {
        value: u64,
    }

    impl Counter {
        /// Initialize a new counter.
        pub fn new() -> Self {
            Self { value: 0 }
        }

        /// Get the current count.
        pub fn get_count(&self) -> u64 {
            self.value
        }

        /// Increment the counter.
        pub fn increment(&mut self) {
            self.value = self.value.saturating_add(1);
        }
    }
}
```

### Key Concepts

| Element | Requirement |
|---------|-------------|
| Module | Annotated with `#[dusk_forge::contract]` |
| Struct | Single public struct (the contract state) |
| Default state | `pub fn new() -> Self` (creates initial state at compile time) |
| Initialization | `pub fn init(&mut self, ...)` (sets up contract data after deployment) |
| Methods | `pub fn` = exported, `fn` = internal helper |

Events are emitted with `abi::emit("event_name", data)` and automatically included in the contract schema.

## Build System

Contracts have **two build targets** from the same source:

1. **Contract WASM** (`make wasm`) - Runs on-chain in the Dusk VM
2. **Data-driver WASM** (`make wasm-dd`) - Runs off-chain for JSON encoding/decoding

The `contract` and `data-driver` features are **mutually exclusive**. See the [Forge README](https://github.com/dusk-network/forge/blob/main/README.md#cargotoml-configuration) for full Cargo.toml configuration.

| Target | Description |
|--------|-------------|
| `make wasm` | Build optimized contract WASM |
| `make wasm-dd` | Build optimized data-driver WASM |
| `make test` | Build WASMs and run tests |
| `make expand` | Show macro-expanded contract code |

:::caution[Security]
Always enable `overflow-checks = true` in release builds. This is critical for contract security.
:::

## Contract Model

### State & Persistence

Unlike EVM-style key-value storage, DuskDS contracts treat the WASM linear memory as the contract state:

- A static state object holds your data (managed by the `#[contract]` macro)
- On each call, the runtime loads the persisted memory, your code updates it, and the runtime writes it back if the call succeeds
- If a call panics or fails, the state is reverted to its previous version

This means:

- You can model state as ordinary Rust structs, collections, and enums
- Use [`BTreeMap`](https://doc.rust-lang.org/alloc/collections/btree_map/struct.BTreeMap.html) instead of `HashMap`
- Use [`BTreeSet`](https://doc.rust-lang.org/alloc/collections/btree_set/struct.BTreeSet.html) instead of `HashSet`

### Host Functions

Contracts call back into the host via `dusk-core`:

- Reading and writing contract memory
- Accessing environment data (block height, timestamps, caller context, public sender)
- Emitting events
- Performing cryptographic operations (hashing, verification)
- Interacting with the transaction model

For the full list of host functions, refer to the [dusk-core crate documentation](https://docs.rs/dusk-core/latest/dusk_core/abi/index.html).

### Serialization and Data Drivers

On the wire, contract arguments and return values are encoded using [`rkyv`](https://github.com/rkyv/rkyv) for zero-copy serialization.

The **data-driver** is a separate WASM build that provides JSON encoding/decoding for external tools (wallets, explorers, frontends) so they can interact with your contract without understanding the binary format:

| Export | Description |
|--------|-------------|
| `init` | Initialize the driver (call once at startup) |
| `get_schema` | Returns the contract schema as JSON |
| `encode_input_fn` | Encodes JSON input for a contract function call |
| `decode_output_fn` | Decodes rkyv output to JSON |
| `decode_event` | Decodes rkyv event data to JSON |

For JavaScript integration, use [w3sper](https://github.com/dusk-network/rusk/tree/master/w3sper.js) which provides a high-level API for working with data-drivers.

## Deploying

To deploy a contract, use the [Rusk Wallet](/learn/rusk-wallet):

```bash
rusk-wallet contract-deploy \
  --code <PATH_TO_WASM_CONTRACT> \
  --init-args <INITIALIZATION_ARGUMENTS> \
  --deploy-nonce <DEPLOY_NONCE> \
  [--address <DEPLOYER_ADDRESS>] \
  [--gas-limit <GAS_LIMIT>] \
  [--gas-price <GAS_PRICE>]
```

The `deploy_nonce` should be a unique number for the deployer's wallet, distinguishing deployments of the same contract. Different wallets deploying the same contract with the same nonce will still get unique addresses (determined by bytecode + nonce + deployer's public key).

### Deployment Fee

Gas fees are proportional to the contract's bytecode size:

`Total Cost = Bytecode Length × GAS_PER_DEPLOY_BYTE × Current Gas Price`

Initialization code is also metered and executed with the given `gas_limit`.

## Testing and Debugging

Because contracts are Rust crates, you can:

- Write unit and integration tests with `#[test]` and `cargo test`
- Use `make expand` to see the macro-expanded code
- Use conventional Rust testing patterns for pure logic
- Use `dusk-vm` in tests to run contracts in a simulated environment

For debugging:

- Check panic messages, error codes, and logs exposed by the node
- Ensure your toolchain matches what the `rust-toolchain.toml` expects
- Use `make expand` to inspect generated code if something isn't working as expected

## Cheatsheet

### Common Host Functions

| Function | Explanation |
|----------|-------------|
| `abi::emit("EVENT_NAME", data)` | Emit a contract event |
| `abi::feed(data)` | Stream data to host (use with `#[contract(feeds = "Type")]`) |

### References

- [Forge README](https://github.com/dusk-network/forge/blob/main/README.md) - Complete macro documentation, Cargo.toml configuration, advanced patterns
- [my-first-contract](https://github.com/dusk-network/my-first-contract) - Canonical example contract
- [dusk-core docs](https://docs.rs/dusk-core/latest/dusk_core/abi/index.html) - Host functions reference
- [Rust Language Cheat Sheet](https://cheats.rs/) - General Rust syntax (not all examples apply in no-std)

## FAQ

**Can a contract deploy another contract?**
Not yet. Contracts cannot currently deploy other contracts on DuskDS.

**How do I pause or lock a contract?**
Contract "locking" / pause behavior is implemented at the contract level. A typical pattern is to keep an `is_paused` flag and an owner/admin key in state, and guard sensitive entrypoints with checks on those fields.

**How do I verify a contract build?**
Use the verifiable build flow described in the [Deterministic Build README](https://github.com/dusk-network/dev-tools/tree/main/deterministic-build).

**What does the `#[contract]` macro generate?**
The macro generates: extern "C" wrapper functions for WASM exports, a `CONTRACT_SCHEMA` constant with metadata, and a data-driver module (when compiled with the data-driver feature). Use `make expand` to see the generated code.
