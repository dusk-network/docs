---
title: DuskVM smart contracts
description: Build Rust and WebAssembly smart contracts that execute directly on the Dusk L1.
---

DuskVM contracts are written in Rust, compiled to WebAssembly (WASM), and executed directly on the Dusk L1. They use the Dusk contract ABI and can integrate with L1 protocol contracts and transaction models.

This path gives contracts direct access to Dusk's L1 execution model, but uses Dusk-specific tooling rather than the Ethereum toolchain.

## Choose an execution environment

| Choose | When you need |
|---|---|
| **DuskVM** | Rust/WASM, Dusk L1 contracts and primitives, or logic that should execute directly on the L1 |
| **[DuskEVM](/developer/duskevm/quickstart/)** | Solidity or Vyper, EVM wallets, and Ethereum-compatible libraries and tooling |

Both environments are general-purpose. DuskVM executes contracts directly on the Dusk L1; DuskEVM provides EVM-compatible execution with settlement and data availability through DuskDS.

## Toolchain

| Component | Role |
|---|---|
| [Forge](https://github.com/dusk-network/forge) | Scaffolds contracts and generates ABI exports, schemas, and data drivers from annotated Rust |
| [DuskVM](/learn/deep-dive/dusk-vm/) | Executes contract WASM and persists contract state |
| [Rusk Wallet](/learn/rusk-wallet/) | Signs and submits deployment and contract-call transactions |
| [Dusk Connect](/developer/integrations/dusk-connect/) | Connects browser dApps to compatible Dusk wallet extensions for account access and transaction approval |
| [W3sper](/developer/integrations/w3sper/) | Connects JavaScript applications to Dusk nodes and contract data drivers |

A typical workflow is:

1. Scaffold a contract with Forge.
2. Implement and test it locally against DuskVM.
3. Build and verify the contract and data-driver WASM artifacts.
4. Deploy the contract, then connect applications through Dusk Connect, W3sper, or the HTTP API.

Start with the [DuskVM quickstart](/developer/duskvm/quickstart/). Use the [contract reference](/developer/duskvm/reference/) when you need the ABI, state, serialization, event, or deployment details.
