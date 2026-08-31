---
title: Glossary
description: Dusk-specific terms and concepts used across the docs.
---

## Dusk terminology

#### Account

Accounts in Dusk manage transactions with different visibility levels. An account is linked to a profile and categorized as either a [Shielded Account](#shielded-account) (privacy-preserving) or a [Public Account](#public-account) (transparent).

#### Archive Node

An [archive node](/operator/archive-node) stores the full historical record of the Dusk blockchain and exposes archive-specific historical queries. Archive mode can also participate in consensus because it extends the regular node stack rather than replacing it.

#### Citadel

[Citadel](/developer/digital-identity/protocol) is Dusk's identity and access layer (selective disclosure).

#### Confidential Security Contract Standard (XSC)

Live Dusk L1 technology for confidential smart contracts that can be adapted to business requirements such as privacy constraints and eligibility rules.

#### Delivery versus payment (DvP)

A live Dusk L1 contract capability that coordinates the asset and payment legs of settlement so one leg does not complete without the other. See the public [Dusk DvP example](https://github.com/dusk-network/dvp-demo).

#### Dusk

Dusk is the name of the organization and the broader product and network suite. Where the technical meaning could be ambiguous, these docs use **Dusk network** for the protocol generally and **Dusk L1** for the complete base layer.

#### DUSK

The native token of Dusk. It is used to pay for transaction fees (gas) and staking.

#### DuskDS

DuskDS is the Dusk Data Availability and Settlement layer: the consensus, finality, and data-availability foundation of the Dusk L1, including its Moonlight and Phoenix transaction models.

#### DuskEVM

[DuskEVM](/learn/dusk-evm/) is a live EVM execution environment on the public DuskEVM testnet. It uses DuskDS as its settlement and data availability layer.

#### DuskVM

[DuskVM](/learn/deep-dive/dusk-vm) is the Rust/WASM smart-contract execution environment that runs directly on the Dusk L1.

#### Hedger

Hedger is the live evolution of Zedger, available on the public DuskEVM testnet.

#### Forge

[Forge](https://github.com/dusk-network/forge) is the live DuskVM contract framework and code-generation tool for Rust/WASM contracts.

#### Stake Abstraction (Hyperstaking)

Stake abstraction (also called hyperstaking) is a live, permissionless capability that lets smart contracts participate in staking and manage rewards with on-chain logic.

See: [Stake Abstraction](/learn/hyperstaking).

#### Kadcast

[Kadcast](/learn/core-components#network-layer-kadcast) is Dusk's P2P networking layer.

#### LUX

The smallest denomination of DUSK.

- `1 DUSK = 1,000,000,000 LUX`

#### Moonlight

[Moonlight](/learn/deep-dive/duskds-tx-models) is Dusk's public, account-based transaction model.

#### Phoenix

[Phoenix](/learn/deep-dive/duskds-tx-models) is Dusk's live shielded, UTXO-based transaction model. Admission of new Phoenix transactions is temporarily paused pending a follow-up upgrade; Phoenix is not retired.

#### Profile

A profile is a pairing of a Moonlight (public) account and a Phoenix (shielded) account derived from a single mnemonic.

Wallets use profiles so you can manage both models side-by-side while keeping keys and addresses organized.

![Wallet hierarchy](../../../assets/wallet_hierarchy.png)

#### Provisioner

A provisioner is a staker running a node that can be selected for consensus duties (block generation and committee slots).

See: [Run a provisioner node](/operator/provisioner).

#### Public Account

A public account uses Moonlight and is designed for transparent transactions. It uses public addresses.

#### RUES

RUES (Rusk Universal Event System) is the event system used to stream chain events to external consumers.

#### Rusk

[Rusk](/learn/core-components#rusk) is the Rust node implementation for the Dusk L1. It runs DuskDS consensus and DuskVM execution.

#### Rusk Wallet

The [Rusk Wallet](/use/wallets#rusk-wallet) is the official CLI wallet for Dusk.

#### Shielded Account

A shielded account uses Phoenix and is designed for privacy-preserving transactions.

#### Succinct Attestation

Succinct Attestation is Dusk's proof-of-stake consensus protocol.

#### W3sper SDK

[W3sper](/developer/integrations/w3sper) is the live JavaScript SDK for direct Rusk access and Dusk application integrations.

#### Web Wallet

The [Web Wallet](/use/wallets#web-wallet) is Dusk's official hosted browser wallet interface.

#### Zedger

[Zedger](/learn/core-components#zedger--hedger) is a protocol for private, compliant issuance and management of regulated assets. It is currently paused in favor of Hedger.
