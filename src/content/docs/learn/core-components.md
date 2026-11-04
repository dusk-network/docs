---
title: Core Components
description: Introduction to the core components that power Dusk as infrastructure for regulated digital assets.
---

The Dusk network uses a modular architecture built for regulated finance: privacy where it is needed, transparency where it is useful, and deterministic settlement where market workflows require it.

At a high level:

| Component | Role | Availability | Where to go next |
|---|---|---|---|
| **DuskDS** | Settlement and data-availability foundation: consensus, finality, and Dusk transaction models | Live on mainnet | [Transaction Models](/learn/deep-dive/duskds-tx-models), [Run a node](/operator/overview) |
| **Rusk** | The Rust node implementation for the Dusk L1 | Live on mainnet | [HTTP API](/developer/integrations/http-api/), <a href="https://github.com/dusk-network/rusk/" target="_blank" rel="noreferrer">GitHub</a> |
| **DuskVM** | Rust/WASM smart-contract execution directly on the Dusk L1 | Live on mainnet | [DuskVM deep dive](/learn/deep-dive/dusk-vm/), [DuskVM contracts](/developer/duskvm/overview/) |
| **DuskEVM** | OP Stack-based EVM execution settled through DuskDS | Live on public testnet | [DuskEVM overview](/learn/dusk-evm/), [DuskEVM quickstart](/developer/duskevm/quickstart/) |
| **Citadel 2** | Identity and access primitives for selective disclosure | Live and usable | [Digital Identity protocol](/developer/digital-identity/protocol/) |

## Capability and product status

This status map separates available protocol capabilities from products that are still being built. “Live” does not imply mainnet when a row explicitly says testnet.

| Capability or product | Current status |
| --- | --- |
| **Moonlight** | Live public account and transaction model on Dusk mainnet |
| **Phoenix** | Live shielded transaction technology; admission of new Phoenix transactions is temporarily paused pending a follow-up upgrade |
| **Hyperstaking** | Live, permissionless stake-abstraction capability; any developer can deploy a contract that uses it |
| **W3sper** | Live and usable JavaScript SDK for direct Rusk access and Dusk application integrations |
| **Forge** | Live and usable DuskVM contract framework and code-generation tool |
| **Hedger** | Live on the public DuskEVM testnet |
| **Zedger** | Paused in favor of Hedger |
| **Citadel 2** | Live and usable identity and selective-disclosure protocol |
| **XSC** | Live confidential security-contract technology on the Dusk L1 |
| **Delivery versus payment (DvP)** | Live Dusk L1 contract capability for coordinating asset and payment legs |
| **Dusk Trade** | Being built |

## DuskDS

DuskDS is the Dusk Data Availability and Settlement layer. It is the consensus, finality, and data-availability foundation of the Dusk L1, and includes the Moonlight and Phoenix transaction models used to transfer DUSK and pay for execution.

DuskDS is not a name for the complete Dusk network. The Dusk L1 also includes DuskVM smart-contract execution, while DuskEVM is an EVM-compatible execution layer that settles and publishes data through DuskDS.

DuskDS supports two transaction models: **Moonlight** for transparent public accounts and **Phoenix** for confidential shielded transfers. Moonlight is available for new public transactions. Phoenix remains live protocol technology, while admission of new Phoenix transactions is temporarily paused pending a follow-up upgrade. See: [Transaction Models on Dusk](/learn/deep-dive/duskds-tx-models/) and [Privacy on Dusk](/learn/privacy-on-dusk/).

### Rusk

<a href="https://github.com/dusk-network/rusk/" target="_blank" rel="noreferrer">Rusk</a> is the Rust node implementation for the Dusk L1. It runs DuskDS consensus, maintains chain state, executes DuskVM contracts, and exposes the HTTP API and RUES event system used by wallets, indexers, and integrators.

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

Dusk provides two smart-contract environments at different layers of the architecture.

### DuskVM
[DuskVM](/learn/deep-dive/dusk-vm) is the Wasmtime-based execution environment for Rust/WASM contracts that run directly on the Dusk L1. It is the path for contracts that need direct access to L1 assets, transaction models, privacy, or zero-knowledge capabilities.

### DuskEVM
[DuskEVM](/learn/dusk-evm/) is a live OP Stack-based EVM-equivalent execution environment on the public DuskEVM testnet. It lets you deploy Solidity contracts using standard EVM tooling while using DuskDS for settlement and data availability.

## Developer tooling and programmable staking

- [**W3sper**](/developer/integrations/w3sper/) is the live JavaScript SDK for direct node queries, account and shielded-state synchronization, contract data drivers, and lower-level application integration.
- [**Forge**](https://github.com/dusk-network/forge) is the live DuskVM contract framework and code-generation tool for Rust/WASM contracts.
- [**Hyperstaking**](/learn/hyperstaking/) is a live, permissionless capability that lets smart contracts stake DUSK and implement pools, reward distribution, and other programmable staking logic.

## Network Layer: Kadcast

<a href="https://github.com/dusk-network/kadcast/blob/main/README.md" target="_blank" rel="noreferrer">Kadcast</a> is Dusk’s P2P networking layer. It uses a structured overlay (instead of random gossip) to reduce bandwidth and improve latency predictability.

## Genesis Contracts

Dusk ships with two genesis contracts:

- **Stake**: tracks provisioners, stakes, rewards, and validator set management. (<a href="https://github.com/dusk-network/contracts/tree/main/genesis/stake" target="_blank" rel="noreferrer">source</a>)
- **Transfer**: transfers `DUSK` and is the entry point for transaction execution and gas payment. (<a href="https://github.com/dusk-network/contracts/tree/main/genesis/transfer" target="_blank" rel="noreferrer">source</a>)

For node operators: [Run a provisioner node](/operator/provisioner/).

## Applications

On top of the base protocol, Dusk supports application-layer protocols and tools for regulated markets.

### Dusk Trade

[Dusk Trade](/learn/dusk-trade) is being built as the application layer for tokenized financial assets on Dusk. It is designed around real market workflows: investor onboarding, wallet binding, controlled transfers, payment coordination, and compliant settlement.

### Zedger / Hedger

Zedger and Hedger are protocols for issuing and managing regulated assets with built-in compliance and privacy constraints.

- **Zedger** uses DuskVM contracts on the Dusk L1 and is currently paused in favor of Hedger.
- **Hedger** is live on the public DuskEVM testnet and offers an EVM-first developer experience.

Hedger is currently available as a testnet preview. See [Try Hedger on DuskEVM Testnet](/learn/guides/hedger-testnet/).

### Citadel

![Citadel](../../../assets/citadel.gif)

Citadel 2 is Dusk’s live identity and access protocol. It supports selective disclosure so users can prove attributes (e.g. residency, age bracket, accreditation) without revealing more than necessary.

[Deep dive into Citadel](/developer/digital-identity/protocol) 

### XSC and delivery versus payment

The **Confidential Security Contract Standard (XSC)** is live Dusk L1 technology for smart contracts whose privacy and eligibility rules can be adapted to regulated-asset requirements.

**Delivery versus payment (DvP)** is a live Dusk L1 contract capability for coordinating the asset and payment legs of settlement. The public [Dusk DvP example](https://github.com/dusk-network/dvp-demo) demonstrates the contract and application pattern.
