---
title: DuskEVM
description: DuskEVM is an OP Stack-based EVM execution environment that uses DuskDS for settlement and data availability.
---

DuskEVM is an EVM-equivalent execution environment built on the OP Stack that uses DuskDS for settlement and data availability.

Use DuskEVM when your application benefits from Solidity, Ethereum-compatible tooling, EVM wallets, and existing smart contract infrastructure.

Use native Dusk development instead when your application should be built directly against Dusk's own execution model: Rust/WASM contracts, native transaction models, protocol-level assets, custom market logic, or privacy and zero-knowledge capabilities. For that path, see [DuskVM](/learn/deep-dive/dusk-vm/) and [Smart Contracts on DuskDS](/developer/smart-contracts-duskds/).

## Where DuskEVM fits

DuskEVM is the EVM execution path in the Dusk stack:

- **Developers** use familiar Solidity tooling.
- **Applications** can inherit settlement and data availability from DuskDS.
- **Users** pay gas in DUSK on DuskEVM.
- **Privacy-sensitive flows** can use additional Dusk tooling such as Hedger where appropriate.

For the broader architecture, see [Core Components](/learn/core-components).

## Network Information

| Field | **Mainnet** | **Testnet** | **Devnet** |
|---|---|---|---|
| **Chain name** | DuskEVM | DuskEVM Testnet | DuskEVM Devnet |
| **Chain ID** | 744 | 745 | 310 |
| **Native token** | DUSK (18) | DUSK (18) | DUSK (18) |
| **RPC (HTTPS)** | `https://rpc.evm.dusk.network` | `https://rpc.testnet.evm.dusk.network` | `https://rpc.devnet.evm.dusk.network` |
| **RPC (WSS)** | `wss://wss.evm.dusk.network` | `wss://wss.testnet.evm.dusk.network` | `wss://wss.devnet.evm.dusk.network` |
| **Explorer** | `https://explorer.evm.dusk.network/` | `https://explorer.testnet.evm.dusk.network/` | `https://explorer.devnet.evm.dusk.network/` |
| **Avg. block time** | ~2s | ~2s | ~2s |

## Quick Checks (RPC)

Confirm you are connected to the right chain:

```bash
curl -sS -H 'content-type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"eth_chainId","params":[]}' \
  https://rpc.testnet.evm.dusk.network

# -> {"jsonrpc":"2.0","id":1,"result":"0x2e9"}  (745)
```

## Common Workflows

- Fund an EVM wallet on testnet (bridge DUSK from DuskDS): [Bridge DUSK from DuskDS to DuskEVM Testnet](/learn/guides/duskevm-bridge/)
- Deploy a Solidity contract: [Deploy on DuskEVM](/developer/smart-contracts-dusk-evm/deploy-on-evm/)

## How It Works (High-Level)

- The sequencer executes EVM transactions (OP Stack / `op-geth`).
- The batcher posts transaction data to DuskDS (as blobs).
- The proposer posts state commitments that reference executed batches.

## Fees

On OP-Stack chains like DuskEVM, the fee you pay typically includes:

- An L2 execution fee (EIP-1559 style).
- A data-availability fee for posting batch data to DuskDS.

Wallets and SDKs usually estimate both automatically. If you’re doing your own fee logic, treat total cost as `execution + data`.

## Runtime Differences

Most EVM behavior is identical, but a few fields behave differently due to the OP Stack / bridge model:

| Opcode      | Solidity Equivalent | Behavior |
|-------------|---------------------|----------|
| `COINBASE`  | `block.coinbase`    | Address of the sequencer fee wallet. |
| `PREVRANDAO`| `block.prevrandao`  | PREVRANDAO derived from the DuskDS origin block. |
| `ORIGIN`    | `tx.origin`         | For bridge deposits (**DuskDS ⇒ DuskEVM**), `tx.origin` is set to the aliased address of the originator. |

:::note
DuskEVM currently has no public mempool (sequencer only).
:::

## Verify a Contract (Blockscout)

DuskEVM uses Blockscout as its explorer. Choose the workflow that matches your toolchain:

- Blockscout UI (Verify & Publish): <a href="https://docs.blockscout.com/devs/verification" target="_blank" rel="noreferrer">docs.blockscout.com/devs/verification</a>
- Hardhat plugin: <a href="https://docs.blockscout.com/devs/verification/hardhat-verification-plugin" target="_blank" rel="noreferrer">docs.blockscout.com/devs/verification/hardhat-verification-plugin</a>
- Foundry (Forge): <a href="https://docs.blockscout.com/devs/verification/foundry-verification" target="_blank" rel="noreferrer">docs.blockscout.com/devs/verification/foundry-verification</a>
