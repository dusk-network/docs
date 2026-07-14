---
title: DuskVM quickstart
description: Create, test, build, and deploy a Rust/WASM contract with Forge.
---

This quickstart creates a counter contract with Forge 0.3, tests its compiled WASM in DuskVM, and builds the artifacts needed for deployment and application integration.

## Prerequisites

Install [Rust through rustup](https://www.rust-lang.org/tools/install), Git, and a C build toolchain (`build-essential` on Debian or Ubuntu, or Xcode Command Line Tools on macOS). Add the Rust component and compilation target required by Forge, then install the CLI from its tagged release:

```bash
rustup toolchain install stable \
  --component rust-src \
  --target wasm32-unknown-unknown

cargo install --git https://github.com/dusk-network/forge \
  --tag v0.3.0 dusk-forge-cli
```

The generated project selects that stable Rust toolchain and target through `rust-toolchain.toml`.

## 1. Create the contract

```bash
dusk-forge new dusk-counter
cd dusk-counter
dusk-forge check
```

The project contains the contract in `src/lib.rs` and DuskVM integration tests in `tests/contract.rs`. Its `rust-toolchain.toml`, Cargo features, release overflow checks, and WASM target are ready for DuskVM development.

The generated counter demonstrates the core model:

- one Rust struct holds the contract state;
- `pub const fn new() -> Self` creates its initial state;
- public methods become contract entrypoints;
- methods taking `&mut self` can update persisted state.

## 2. Test in DuskVM

```bash
dusk-forge test
```

Forge first builds the contract WASM. The generated integration tests deploy that artifact into an isolated DuskVM session and exercise successful state changes and boundary behavior. A node, wallet, and DUSK are not required for these tests.

## 3. Build and inspect

```bash
dusk-forge build
dusk-forge schema --pretty
dusk-forge verify
```

The build produces two WASM files from the same Rust source:

| Artifact | Path |
|---|---|
| On-chain contract | `target/contract/wasm32-unknown-unknown/release/dusk_counter.wasm` |
| Off-chain data driver | `target/data-driver/wasm32-unknown-unknown/release/dusk_counter.wasm` |

`schema` lists the exported functions and registered events. `verify` checks both WASM artifacts and prints the contract hash.

## 4. Encode call arguments

Contract inputs use `rkyv`, not JSON or Solidity ABI encoding. Forge uses the data driver to encode readable input:

```bash
dusk-forge call set_count --input '42'
```

For the generated counter this returns:

```text
0x2a00000000000000
```

Keep the `0x` prefix when an SDK expects prefixed hex. Remove it for `rusk-wallet --fn-args`.

## 5. Deploy on testnet

Install [Rusk Wallet 0.3.0 or later](https://github.com/dusk-network/rusk/releases?q=rusk+wallet&expanded=true), configure it for testnet, and make sure a public account has enough testnet DUSK for deployment. [Request funds from the testnet faucet](/operator/networks/#how-to-get-testnet-tokens) if needed. The commands below target testnet explicitly and use the wallet's first address by default; add `--address <ADDRESS>` to use another funded address. Testnet DUSK has no monetary value.

Deploy the on-chain artifact with a nonce you have not used for the same contract and account:

```bash
rusk-wallet --network testnet contract-deploy \
  --code target/contract/wasm32-unknown-unknown/release/dusk_counter.wasm \
  --deploy-nonce <UNIQUE_NONCE>
```

The wallet first prints `Deploying <CONTRACT_ID>`, waits for inclusion, and then prints the deployment transaction hash. Keep the contract ID from the first line for later calls.

Call an entrypoint with no arguments by passing an empty hex value:

```bash
rusk-wallet --network testnet contract-call \
  --contract-id <CONTRACT_ID> \
  --fn-name increment \
  --fn-args ''
```

For a call with input, encode it with Forge and strip the prefix expected by Forge's output:

```bash
ARGS=$(dusk-forge call set_count --input '42')

rusk-wallet --network testnet contract-call \
  --contract-id <CONTRACT_ID> \
  --fn-name set_count \
  --fn-args "${ARGS#0x}"
```

`contract-call` submits a transaction and waits for inclusion. In a browser dApp, use [Dusk Connect](/developer/integrations/dusk-connect/) to discover wallet extensions, request account access, and ask the selected wallet to approve transactions. Use [W3sper](/developer/integrations/w3sper/) or the [Rusk HTTP API](/developer/integrations/http-api/) for direct node queries and contract data-driver integration.

Before building a production contract, read the [DuskVM contract reference](/developer/duskvm/reference/).
