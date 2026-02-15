---
title: DuskEVM
description: DuskEVM is a fully EVM-compatible execution environment built on the Dusk Network.
---

DuskEVM is an EVM-equivalent execution environment built on the OP Stack that settles to DuskDS.

## Network Information

| Field | **Mainnet** | **Testnet** | **Devnet** |
|---|---|---|---|
| **Live** | No | Yes | No |
| **Chain name** | DuskEVM | DuskEVM Testnet | DuskEVM Devnet |
| **Chain ID** | 744 | 745 | 311 |
| **Native token** | DUSK (18) | DUSK (18) | DUSK (18) |
| **RPC (HTTPS)** | `https://rpc.evm.dusk.network` | `https://rpc.testnet.evm.dusk.network` | `https://rpc.devnet.evm.dusk.network` |
| **RPC (WSS)** | `wss://wss.evm.dusk.network` | `wss://wss.testnet.evm.dusk.network` | `wss://wss.devnet.evm.dusk.network` |
| **Explorer** | `https://explorer.evm.dusk.network/` | `https://explorer.testnet.evm.dusk.network/` | `https://explorer.devnet.evm.dusk.network/` |
| **Avg. block time** | ~2s | ~2s | ~2s |

## How It Works (High-Level)

- The sequencer executes EVM transactions (OP Stack / `op-geth`).
- The batcher posts transaction data to DuskDS (as blobs).
- The proposer posts state commitments that reference executed batches.

## Fees

On OP-Stack chains like DuskEVM, the fee you pay typically includes:

- An L2 execution fee (EIP-1559 style).
- A data-availability fee for posting batch data to DuskDS.

## Opcodes

| Opcode      | Solidity Equivalent | Behavior |
|-------------|---------------------|----------|
| `COINBASE`  | `block.coinbase`    | Address of the sequencer fee wallet. |
| `PREVRANDAO`| `block.prevrandao`  | PREVRANDAO derived from the DuskDS origin block. |
| `ORIGIN`    | `tx.origin`         | For **DuskDS ⇒ DuskEVM** transactions, `tx.origin` is set to the aliased address of the originator. |

:::note
DuskEVM currently has no public mempool (sequencer only).
:::

## Verify a Contract (Blockscout)

DuskEVM uses Blockscout as its explorer. Choose the workflow that matches your toolchain:

- Blockscout UI (Verify & Publish): <a href="https://docs.blockscout.com/devs/verification" target="_blank" rel="noreferrer">docs.blockscout.com/devs/verification</a>
- Hardhat plugin: <a href="https://docs.blockscout.com/devs/verification/hardhat-verification-plugin" target="_blank" rel="noreferrer">docs.blockscout.com/devs/verification/hardhat-verification-plugin</a>
- Foundry (Forge): <a href="https://docs.blockscout.com/devs/verification/foundry-verification" target="_blank" rel="noreferrer">docs.blockscout.com/devs/verification/foundry-verification</a>
