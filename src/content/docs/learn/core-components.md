---
title: Core Components
description: Introduction to the core components that power Dusk.
---

Dusk is a modular blockchain architecture built for regulated finance: privacy where it’s needed, transparency where it’s required.

At a high level:

| Component | Role | Where to go next |
|---|---|---|
| **DuskDS** | Settlement, consensus, and data availability | [Transaction Models](/learn/deep-dive/duskds-tx-models), [Run a node](/operator/overview) |
| **Rusk** | The Rust node implementation that runs DuskDS and exposes APIs | [HTTP API](/developer/integrations/http-api/), <a href="https://github.com/dusk-network/rusk/" target="_blank" rel="noreferrer">GitHub</a> |
| **DuskVM** | WASM execution environment for native smart contracts | [DuskVM deep dive](/learn/deep-dive/dusk-vm/), [Smart Contracts on DuskDS](/developer/smart-contracts-duskds/) |
| **DuskEVM** | OP Stack-based EVM execution environment | [DuskEVM deep dive](/learn/deep-dive/dusk-evm/), [Deploy on DuskEVM](/developer/smart-contracts-dusk-evm/deploy-on-evm/) |
| **Citadel** | Identity and access primitives (selective disclosure) | [Digital Identity protocol](/developer/digital-identity/protocol/) |

## DuskDS

DuskDS is the settlement, consensus, and data availability layer at the foundation of the Dusk architecture. It provides finality, security, and native bridging for execution environments built on top (including DuskEVM and DuskVM).

DuskDS includes Rusk (the node implementation), Succinct Attestation (PoS consensus), Kadcast (P2P networking), and the genesis contracts (stake + transfer).

DuskDS supports two transaction models: **Moonlight** (public) and **Phoenix** (shielded). See: [Transaction Models on Dusk](/learn/deep-dive/duskds-tx-models/).

### Rusk

<a href="https://github.com/dusk-network/rusk/" target="_blank" rel="noreferrer">Rusk</a> is the Rust implementation of DuskDS. It runs consensus, maintains chain state, and exposes external APIs (including the HTTP API and RUES event system used by wallets, indexers, and integrators).

### Succinct Attestation

Succinct Attestation (SA) is DuskDS’s permissionless, committee-based proof-of-stake consensus protocol. It uses randomly selected provisioners to propose, validate, and ratify blocks, providing fast, deterministic finality suitable for financial markets.

At a high level, each round goes through three steps:

- **Proposal** – a provisioner creates and broadcasts a candidate block.
- **Validation** – a committee checks the block’s validity.
- **Ratification** – another committee confirms the validation outcome and finalizes the block.

For the full protocol specification and security analysis (including committee selection, finality, and slashing), see Section 3 “Consensus mechanism” of the [Dusk Whitepaper (2024)](https://dusk-cms.ams3.digitaloceanspaces.com/Dusk_Whitepaper_2024_4db72f92a1.pdf).

### Transactions in DuskDS

Transactions in DuskDS are managed by the **Transfer** contract, which supports both public and shielded transfers.

Moonlight is account-based and public. Phoenix is UTXO-based and shielded. Both are used to transfer `DUSK`, pay gas, and act as the entry point for contract execution.

## Execution environments

Dusk supports multiple execution environments on top of DuskDS. Each environment can focus on a specific developer experience (WASM vs EVM) while inheriting settlement and data availability from DuskDS.

### Dusk VM
[Dusk VM](/learn/deep-dive/dusk-vm) is a WASM execution environment built around Wasmtime. It’s optimized for Dusk-native smart contracts and privacy-focused applications.

### Dusk EVM
[Dusk EVM](/learn/deep-dive/dusk-evm) is an OP Stack-based EVM-equivalent execution environment. It lets you deploy Solidity contracts using standard EVM tooling while using DuskDS for settlement and data availability.

## Network Layer: Kadcast

<a href="https://github.com/dusk-network/kadcast/blob/main/README.md" target="_blank" rel="noreferrer">Kadcast</a> is Dusk’s P2P networking layer. It uses a structured overlay (instead of random gossip) to reduce bandwidth and improve latency predictability.

## Genesis Contracts

Dusk ships with two genesis contracts:

- **Stake**: tracks provisioners, stakes, rewards, and validator set management. (<a href="https://github.com/dusk-network/rusk/tree/master/contracts/contracts/stake" target="_blank" rel="noreferrer">source</a>)
- **Transfer**: transfers `DUSK` and is the entry point for transaction execution and gas payment. (<a href="https://github.com/dusk-network/rusk/tree/master/contracts/contracts/transfer" target="_blank" rel="noreferrer">source</a>)

For node operators: [Run a provisioner node](/operator/provisioner/).

## Applications

On top of the base protocol, Dusk supports application-layer protocols for regulated markets.

### Zedger / Hedger

Zedger and Hedger are protocols for issuing and managing regulated assets with built-in compliance and privacy constraints.

- **Zedger** runs natively on DuskDS.
- **Hedger** runs on DuskEVM to offer an EVM-first developer experience.

### Citadel

![Citadel](../../../assets/citadel.gif)

Citadel is Dusk’s identity and access layer. It supports selective disclosure so users can prove attributes (e.g. residency, age bracket, accreditation) without revealing more than necessary.

[Deep dive into Citadel](/developer/digital-identity/protocol) 
