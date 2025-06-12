---
title: DuskEVM
description: DuskEVM is a fully EVM-compatible Layer 2 rollup built on the Dusk Network. Powered by the OP Stack and EIP-4844 (Proto-Danksharding), it enables developers to leverage Ethereum tooling while settling on Dusk L1’s compliant, privacy-preserving infrastructure.
---

DuskEVM is an EVM-equivalent L2 execution environment built on Dusk. It leverages the <a href="https://docs.optimism.io/stack/getting-started" target="_blank">OP Stack</a> and supports <a href="https://www.eip4844.com/" target="_blank">EIP-4844</a> (Proto-Danksharding) to deliver scalable and modular EVM execution while settling on the regulatory compliant and privacy-focused Dusk (L1) infrastructure.

DuskEVM allows developers to deploy smart contracts using familiar EVM tooling while benefiting from Dusk’s privacy-preserving and compliant settlement layer. 

The **separation of execution and settlement environments** introduces modularity into Dusk’s tech stack, enabling scalability, extensibility, and protocol composability. DuskEVM makes it easier to integrate with EVM applications while positioning Dusk L1 as a dedicated data availability and settlement layer. 

:::note[Note]
DuskEVM adds EVM compatibility to Dusk's compliant, privacy-first infrastructure for regulated financial markets.
:::



## Dusk's Modular Stack

With the introduction of DuskEVM, Dusk has expanded into a modular stack, providing a clean separation between execution and settlement environments:

| Layer                 | Description                                                                 |
|-----------------------|-----------------------------------------------------------------------------|
| **Dusk (L1)**          | Base layer for data availability, consensus, and compliant settlement      |
| **DuskEVM&nbsp;(L2)** | EVM execution environment for smart contracts, fully supporting EVM tooling |


This modular approach makes Dusk highly extensible. New execution environments can be introduced without modifying the settlement layer, allowing each layer to evolve independently while remaining interoperable.

:::note[Note]
Future versions of the Dusk stack may introduce additional L2s, including a standalone privacy-preserving L2 execution environment based on the native DuskVM.
:::


### How DuskEVM works
The Ethereum Virtual Machine (EVM) is a general-purpose, stack-based, stateless execution environment that processes smart contract logic. It is independent of consensus and data availability, and this is why many L2 rollups run their own EVM instances.

DuskEVM operates within a L2 rollup that settles on Dusk (L1) instead of Ethereum. This enables full EVM-equivalence while inheriting the privacy, confidentiality, and compliance features of Dusk.

:::note[Note]
DuskEVM uses Dusk (L1) to store call data and blobs, leveraging Dusk's privacy and regulatory compliance guarantees.
:::

### Components

Similarly to other EVM rollups, DuskEVM relies on the following components:

| Component       | Description                                                             |
|----------------|-------------------------------------------------------------------------|
| **Sequencer**   | Batches user transactions                                               |
| **L2 Node**     | Executes smart contracts in the EVM (e.g., Geth/Reth)                   |
| **Batcher**     | Posts data back to L1 (Dusk)                                            |
| **Fraud Proofs**| Mechanism to challenge invalid L2 state transitions                     |

Unlike other EVM rollups that settle on Ethereum, DuskEVM settles on Dusk L1. This was achieved without modifying the <a href="https://github.com/ethereum-optimism/optimism" target="_blank">Optimism</a> stack. Instead, Dusk extends it through modular side services that integrate seamlessly with the core architecture.

:::note[Note]
DuskEVM settles on Dusk (L1), gaining direct access to Dusk's privacy-preserving infrastructure and compliance-focused settlement layer.
:::

### Architecture

          ┌──────────────────────┐
          │     User / dApp      │
          └────────┬─────────────┘
                   │
        ┌──────────▼──────────┐
        │     DuskEVM L2      │  ← Optimistic Rollup (OP Stack)
        │   (EVM Execution)   │
        └──────────┬──────────┘
                   │ Blobs
        ┌──────────▼──────────┐
        │     Dusk L1 DA      │  ← Data Availability & Settlement
        │  Confidential,      │
        └─────────────────────┘

