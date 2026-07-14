---
title: Native Dusk contracts
description: Build Rust and WebAssembly smart contracts for Dusk's native execution environment.
---

Native Dusk contracts are written in Rust, compiled to WebAssembly (WASM), and executed by [DuskVM](/learn/deep-dive/dusk-vm/) on Dusk's L1. They use Dusk's native contract ABI and can integrate directly with the contracts and transaction models that make up DuskDS.

This is the lower-level development path on Dusk. It gives a contract direct access to Dusk's native execution model, but uses Dusk-specific tooling rather than the Ethereum toolchain.

## Choose an execution environment

| Choose | When you need |
|---|---|
| **Native Dusk** | Rust/WASM, Dusk-native contracts and primitives, or logic that belongs close to the settlement layer |
| **[DuskEVM](/developer/duskevm/quickstart/)** | Solidity or Vyper, EVM wallets, and Ethereum-compatible libraries and tooling |

Both environments are general-purpose. The choice is primarily about the execution model and developer ecosystem your application needs.

## Toolchain

| Component | Role |
|---|---|
| [Forge](https://github.com/dusk-network/forge) | Scaffolds contracts and generates ABI exports, schemas, and data drivers from annotated Rust |
| [DuskVM](/learn/deep-dive/dusk-vm/) | Executes contract WASM and persists contract state |
| [Rusk Wallet](/learn/rusk-wallet/) | Signs and submits deployment and contract-call transactions |
| [W3sper](/developer/integrations/w3sper/) | Connects JavaScript applications to Dusk nodes and contract data drivers |

A typical workflow is:

1. Scaffold a contract with Forge.
2. Implement and test it locally against DuskVM.
3. Build and verify the contract and data-driver WASM artifacts.
4. Deploy the contract and submit calls through Rusk Wallet or an SDK.

Start with the [native Dusk quickstart](/developer/duskds/quickstart/). Use the [contract reference](/developer/duskds/reference/) when you need the ABI, state, serialization, event, or deployment details.
