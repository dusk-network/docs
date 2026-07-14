---
title: DuskEVM
description: Build Ethereum-compatible applications on an execution layer settled by DuskDS.
---

DuskEVM brings Solidity, EVM wallets, and Ethereum tooling to Dusk. Existing EVM applications can target DuskEVM with familiar contracts and workflows while using DUSK for gas and DuskDS for settlement and data availability.

## Why DuskEVM

- **Start with the EVM stack.** Use Solidity or Vyper with Foundry, Hardhat, viem, ethers, and standard EVM wallets.
- **Use DUSK natively.** DUSK pays for execution and moves between DuskDS and DuskEVM through the bridge.
- **Settle on DuskDS.** Batches and state commitments anchor DuskEVM activity to Dusk's consensus and data-availability layer.
- **Reach the wider Dusk stack.** EVM applications can connect to Dusk-native assets, infrastructure, and privacy-oriented workflows as those integrations require.

## How it fits

| Component | Role |
|---|---|
| **DuskDS** | Consensus, settlement, and data availability |
| **DuskEVM** | Ethereum-compatible smart contract execution |
| **Bridge** | Moves DUSK and messages between both environments |

A DuskEVM transaction follows a rollup lifecycle:

1. The transaction is submitted to the DuskEVM sequencer.
2. The execution layer includes it in an L2 block.
3. The batcher publishes the transaction data to DuskDS.
4. State commitments and fault proofs connect the resulting state to DuskDS settlement.

Transaction inclusion is fast, but inclusion and settlement are different stages. Applications that move value between DuskEVM and DuskDS should use protocol or wallet status rather than infer finality from elapsed time.

## Choose an execution environment

Choose **DuskEVM** for Solidity applications, EVM wallets, existing Ethereum libraries, and EVM infrastructure.

Choose **native Dusk development** for Rust/WASM contracts, native transaction models, protocol-level assets, or direct use of Dusk's privacy and zero-knowledge capabilities. See [DuskVM](/learn/deep-dive/dusk-vm/) and [Smart Contracts on DuskDS](/developer/smart-contracts-duskds/).

## Start here

- [Deploy a contract with the DuskEVM quickstart](/developer/duskevm/quickstart/)
- [Review networks and EVM behavior](/developer/duskevm/reference/)
- [Bridge DUSK between DuskDS and DuskEVM](/learn/guides/duskevm-bridge/)
