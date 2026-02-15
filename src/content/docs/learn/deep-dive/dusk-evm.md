---
title: DuskEVM
description: DuskEVM is a fully EVM-compatible execution environment built on the Dusk Network. Powered by the OP Stack and EIP-4844 (Proto-Danksharding), it enables developers to leverage EVM tooling while settling on Dusk’s compliant and modular infrastructure.
---

DuskEVM is an EVM-equivalent execution environment within the modular Dusk stack, delivering scalable smart contract execution while inheriting security, consensus, and settlement guarantees from DuskDS.

DuskEVM enables developers to deploy smart contracts using standard EVM tooling while benefiting from a modular architecture designed to support regulatory compliance and meet the needs of financial institutions.

:::note[Note]
The separation of execution environments like DuskEVM from DuskDS introduces modularity into Dusk’s architecture, enabling scalability, extensibility, and protocol composability.
:::

:::note[Note]
EVM-equivalence means that DuskEVM executes transactions using the exact same rules as Ethereum clients. This allows Ethereum smart contracts, tools, and infrastructure to run on DuskEVM without any changes or custom integrations.
:::

## Dusk's Modular Stack

With the introduction of DuskEVM, Dusk has expanded into a modular stack, providing a clean separation between settlement and execution environments:

| Layer            | Description                                            |
|------------------|--------------------------------------------------------|
| **DuskDS**        | Settlement and data availability layer                |
| **DuskEVM**       | EVM execution environment                             |
| **DuskVM**        | WASM execution environment using Phoenix or Moonlight |

DuskDS provides consensus, data availability, and settlement for the disintermediate trading of securities and other regulated assets.

Execution environments like DuskEVM operate at the application layer, where disintermediation logic is executed. These environments can incorporate advanced cryptographic techniques, such as ZK and FHE, to enable privacy-preserving and compliant computations.

:::note[Note]
Dusk's modular architecture makes Dusk highly extensible and composable, as new execution environments can be introduced without modifying the consensus and settlement layer.
:::

## How DuskEVM works

The Ethereum Virtual Machine (EVM) is a general-purpose, stack-based, stateless execution environment that processes smart contract logic. As the EVM is independent of consensus and data availability, it can be instantiated independently.

DuskEVM leverages the <a href="https://docs.optimism.io/stack/getting-started" target="_blank">OP Stack</a> and supports <a href="https://www.eip4844.com/" target="_blank">EIP-4844</a> (Proto-Danksharding).

While DuskEVM uses the OP Stack architecture, it settles directly using DuskDS rather than Ethereum. This required no modification to <a href="https://github.com/ethereum-optimism/optimism" target="_blank">Optimism</a> core components and it has been implemented by adding additional services.

DuskEVM leverages DuskDS to store blobs, enabling developers to use EVM tooling while relying on DuskDS for settlement and data availability.

:::note[Note]
DuskEVM currently inherits a 7-day finalization period from the OP Stack. This is a temporary limitation, as future upgrades will introduce one-block finality.
:::

## Architecture

The diagram below illustrates Dusk’s evolution from a monolithic design to a modular architecture, where DuskDS acts as the foundational consensus, settlement and data availability layer, and multiple execution environments operate independently at the application layer:

![Dusk's modular architecture](../../../../assets/modular_vs_monolithic.png)

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
| **Explorer TX prefix** | `/tx/` | `/tx/` | `/tx/` |
| **Explorer account prefix** | `/address/` | `/address/` | `/address/` |
| **Avg. block time** | ~2s | ~2s | ~2s |

> **Note:** Our testnet currently acts as a devnet.

## Transactions Flow

The process for a rollup transaction has two requirements:
The transaction needs to be written to DuskDS, typically by the <a href="https://github.com/ethereum-optimism/optimism/tree/v1.1.4/op-batcher" target="_blank">op-batcher</a>.

The transaction needs to be executed to modify the state (by <a href="https://github.com/ethereum-optimism/op-geth" target="_blank">op-geth</a>). Afterwards,  <a href="https://github.com/ethereum-optimism/optimism/tree/develop/op-proposer" target="_blank">op-proposer</a> writes a commitment to the post-transaction state to [DuskDS](/learn/core-components#duskds) . Note that op-proposer does not need to write a commitment after each transaction to DuskDS; it is OK to commit to the state after a block of transactions.

More information about the batching process can be seen in the  <a href="https://specs.optimism.io/protocol/derivation.html?utm_source=op-docs&utm_medium=docs#batch-submission" target="_blank">OP stack specs</a>.

## Gas & Fees

On OP‑Stack chains like DuskEVM, every transaction has two cost components: an L2 execution fee (EIP‑1559 base fee + optional priority tip) and an L1 data availability fee. The execution fee pays for running your transaction on the DuskEVM execution layer. The L1 data availability fee covers the cost of publishing your transaction data to DuskDS as blobs for batch posting.

These costs ultimately reflect operator expenses: running the sequencer/batcher infrastructure, posting data to DuskDS, and maintaining archival/monitoring services. As L1 data prices or blob base fees fluctuate, the L1 portion of your fee moves accordingly; the priority tip influences how quickly the private sequencer includes your transaction. Wallets and SDKs typically estimate the total fee automatically; advanced users can query the chain’s gas‑price oracle or estimator to preview both the execution and L1 components.

## Opcodes

| Opcode      | Solidity Equivalent | Behavior                                                                                                                                         |
|-------------|---------------------|--------------------------------------------------------------------------------------------------------------------------------------------------|
| `COINBASE`  | `block.coinbase`    | Returns the address of the current Sequencer's fee wallet. Effectively the same as Ethereum, but typically does not change from block to block. |
| `PREVRANDAO`| `block.prevrandao`  | Returns the PREVRANDAO (the most recent RANDAO) value of DuskDS at the current DuskDS origin block.                                                |
| `ORIGIN`    | `tx.origin`         | For **DuskDS ⇒ DuskEVM** transactions, `tx.origin` is set to the **aliased address** of the originator.                                           |

:::note[Note]
DuskEVM does not have a public mempool, as it is currently only visible to the Sequencer. The Sequencer executes transactions from the mempool in priority fee order (highest fee first).
:::

## Verify a contract on the explorer (Blockscout)

DuskEVM uses [Blockscout](https://www.blockscout.com/) as its block explorer. For verification, follow the official Blockscout documentation and choose the method that fits your workflow:

- Blockscout UI (Verify & Publish): step‑by‑step web flow for source code / Standard JSON input.  
  <a href="https://docs.blockscout.com/devs/verification" target="_blank" rel="noreferrer">docs.blockscout.com/devs/verification</a>
- Hardhat verification plugin: verify from your Hardhat project directly against a Blockscout instance.  
  <a href="https://docs.blockscout.com/devs/verification/hardhat-verification-plugin" target="_blank" rel="noreferrer">Hardhat verification plugin docs</a>
- Foundry (Forge): use `--verifier blockscout` and point `--verifier-url` to your Blockscout API.  
  <a href="https://docs.blockscout.com/devs/verification/foundry-verification" target="_blank" rel="noreferrer">Foundry + Blockscout docs</a>

> **Tips:** Match the compiler version and optimizer settings used at deploy time, and include constructor arguments (ABI‑encoded) or a file when required.
