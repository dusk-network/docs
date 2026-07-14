---
title: DuskEVM reference
description: Network configuration, transaction behavior, fees, finality, and EVM compatibility notes for DuskEVM.
---

## Networks

| Field | Mainnet | Testnet | Devnet |
|---|---|---|---|
| Chain ID | `744` | `745` | `310` |
| Gas token | DUSK (18 decimals) | DUSK (18 decimals) | DUSK (18 decimals) |
| HTTPS RPC | `https://rpc.evm.dusk.network` | `https://rpc.testnet.evm.dusk.network` | `https://rpc.devnet.evm.dusk.network` |
| WSS RPC | `wss://wss.evm.dusk.network` | `wss://wss.testnet.evm.dusk.network` | `wss://wss.devnet.evm.dusk.network` |
| Explorer | `https://explorer.evm.dusk.network` | `https://explorer.testnet.evm.dusk.network` | `https://explorer.devnet.evm.dusk.network` |
| Target block time | ~2 seconds | ~2 seconds | ~2 seconds |

Use `eth_chainId` before signing or submitting a transaction. Mainnet returns `0x2e8`, testnet returns `0x2e9`, and devnet returns `0x136`.

## Transaction handling

DuskEVM uses centralized sequencing. Transactions are submitted to the sequencer instead of broadcast through a public peer-to-peer mempool.

Applications should:

- use the submitted transaction hash to track pending transactions;
- support nonce-based replacement without assuming public mempool visibility; and
- treat a receipt as inclusion, not as proof that every settlement or bridge stage has completed.

## Fees

DUSK pays for DuskEVM transactions. A transaction normally includes:

- an L2 execution fee; and
- a data-availability fee for publishing its share of batch data to DuskDS.

Use `eth_estimateGas` to estimate the execution limit and EIP-1559 fee fields when constructing transactions. Wallets and standard EVM libraries obtain these values through JSON-RPC.

## Inclusion and finality

An included DuskEVM transaction can be visible before its data and state have completed DuskDS settlement.

- **Deposits** are credited on DuskEVM after the Dusk L1 deposit is processed.
- **Withdrawals** require proof, network finality checks, and a separate Dusk L1 finalization transaction.

Use the bridge, wallet, or protocol contract status instead of calculating withdrawal readiness from time alone.

## EVM behavior

Most Solidity contracts require no Dusk-specific changes. Account for these OP Stack behaviors where relevant:

| Solidity value | Behavior |
|---|---|
| `block.coinbase` | Returns the configured sequencer fee recipient. Do not assume it changes between blocks. |
| `block.prevrandao` | Reflects rollup origin metadata. It is not a source of secure or unbiased randomness. |
| `tx.origin` in deposits | Contract-originated Dusk L1 to DuskEVM deposits use OP address aliasing. Use cross-domain messaging when the original sender identity matters. |

## Contract verification

DuskEVM explorers use Blockscout. Verify with the exact compiler version, EVM version, optimizer settings, source files, and constructor arguments used for deployment.

- [Foundry verification](https://docs.blockscout.com/devs/verification/foundry-verification)
- [Hardhat verification](https://docs.blockscout.com/devs/verification/hardhat-verification-plugin)

## Related guides

- [DuskEVM quickstart](/developer/duskevm/quickstart/)
- [Bridge DUSK](/learn/guides/duskevm-bridge/)
- [DuskEVM overview](/learn/dusk-evm/)
