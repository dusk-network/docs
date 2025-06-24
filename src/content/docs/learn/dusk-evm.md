---
title: DuskEVM
description: DuskEVM is a fully EVM-compatible execution environment built on the Dusk Network. Powered by the OP Stack and EIP-4844 (Proto-Danksharding), it enables developers to leverage EVM tooling while settling on Dusk’s compliant and modular infrastructure.
---

DuskEVM is an EVM-equivalent execution environment within the modular Dusk stack, delivering scalable smart contract execution while inheriting security, consensus, and settlement guarantees from DuskDS.

DuskEVM enables developers to deploy smart contracts using standard EVM tooling while benefiting from a modular architecture designed to support regulatory compliance and meet the needs of financial institutions.


The separation of execution environments like DuskEVM from DuskDS introduces modularity into Dusk’s architecture, enabling scalability, extensibility, and protocol composability.


## Dusk's Modular Stack

With the introduction of DuskEVM, Dusk has expanded into a modular stack, providing a clean separation between settlement and execution environments:

| Layer            | Description                                                                 |
|------------------|-----------------------------------------------------------------------------|
| **DuskDS**        | Settlement and data availability layer. It's where consensus and staking happen|
| **DuskEVM**       | EVM execution environment                     |
| **DuskVM**        | Execution environment using Phoenix                  |



DuskDS provides consensus, data availability, and settlement for the disintermediate trading of securities and other regulated assets.

Execution environments like DuskEVM operate at the application layer, where disintermediation logic is executed. These environments can incorporate advanced cryptographic techniques, such as ZK and FHE, to enable privacy-preserving and compliant computations.

:::note[Note]
Dusk's modular architecture makes Dusk highly extensible and composable, as new execution environments can be introduced without modifying the consensus and settlement layer.
:::


### How DuskEVM works

The Ethereum Virtual Machine (EVM) is a general-purpose, stack-based, stateless execution environment that processes smart contract logic. As the EVM is independent of consensus and data availability, it can be instantiated independently.

DuskEVM leverages the <a href="https://docs.optimism.io/stack/getting-started" target="_blank">OP Stack</a> and supports <a href="https://www.eip4844.com/" target="_blank">EIP-4844</a> (Proto-Danksharding)

While DuskEVM uses the OP Stack architecture, it settles directly using DuskDS rather than Ethereum. This required no modification to <a href="https://github.com/ethereum-optimism/optimism" target="_blank">Optimism</a> core components and it has been implemented by adding additional services.


:::note[Note]
DuskEVM leverages DuskDS to store call data and blobs, enabling developers to use EVM tooling while relying on DuskDS for settlement and data availability.
:::


### Components

DuskEVM relies on the following components:

| Component        | Description                                                              |
|------------------|--------------------------------------------------------------------------|
| **Sequencer**     | Batches transactions                                                |
| **Execution Node**| Executes smart contracts
| **Batcher**       | Posts data and transaction batches to DuskDS                             |
| **Fraud Proofs**  | Provides a mechanism to challenge invalid state transitions                         |


:::note[Note]
DuskEVM currently inherits a 7-day challenge period from the OP Stack. This is a temporary limitation, as future upgrades will introduce one-block finality.
:::

### Architecture

          ┌──────────────────────┐
          │     User / dApp      │
          └────────┬─────────────┘
                   │
        ┌──────────▼──────────┐
        │    DuskEVM          │  ← EVM execution environment
        └──────────┬──────────┘
                   │ Blobs
        ┌──────────▼──────────┐
        │      DuskDS         │  ← Consensus and Data Availability
        └─────────────────────┘