---
title: Market Infrastructure on Dusk
description: How Dusk supports regulated asset workflows from issuance to trading, disclosure, and settlement.
---

Dusk is designed for regulated digital asset workflows where the asset, participant permissions, privacy requirements, and settlement process need to coordinate around the same infrastructure.

This page explains the market-infrastructure view of Dusk. For the protocol components underneath it, see [Core Components](/learn/core-components).

## The workflow problem

Regulated markets are rarely just “create a token and transfer it”.

Real workflows usually involve:

- issuers creating and servicing assets
- venues coordinating primary or secondary market activity
- investors proving eligibility
- custodians or wallets controlling access to assets
- payment legs that need to settle with the asset leg
- reporting, disclosure, and supervision requirements

When these steps live in separate systems, market participants need reconciliation, manual controls, and off-chain coordination.

## What Dusk provides

Dusk provides a shared base for market workflows that need both public coordination and protected data.

| Need | Dusk capability |
| --- | --- |
| Participant eligibility | Identity, wallet binding, and access-control patterns |
| Privacy | Phoenix shielded transfers and zero-knowledge proofs |
| Transparency | Moonlight public accounts and public chain data |
| Selective disclosure | Controlled visibility for issuers, venues, auditors, or supervisors |
| Settlement | DuskDS finality and asset/payment coordination patterns |
| EVM compatibility | DuskEVM for Solidity applications and existing EVM tooling |

The goal is not to make every workflow private or every workflow public. The goal is to let builders choose what should be visible, what should be confidential, and what should be disclosed to specific parties.

## Example workflow

A regulated digital asset workflow on Dusk can be designed around:

1. **Issuer setup**: define the asset, eligibility requirements, and lifecycle rules.
2. **Investor onboarding**: bind wallets to verified participants or credentials.
3. **Transfer controls**: enforce who can hold or transfer the asset.
4. **Trading or distribution**: coordinate orders, transfers, and settlement conditions.
5. **Settlement**: connect the asset leg and payment leg with deterministic finality.
6. **Servicing and disclosure**: support reporting, corporate actions, and selective access to required information.

Different applications can implement this differently. Dusk provides the protocol building blocks and execution paths.

## Product fit

Use the Dusk stack depending on the layer you are building:

- **DuskDS** for settlement, data availability, native transaction models, and Dusk-native execution.
- **DuskEVM** for Solidity applications, EVM tooling, and Ethereum-compatible developer workflows.
- **DuskVM** for Rust/WASM contracts that need native Dusk execution.
- **Citadel** for identity, credentials, and selective disclosure patterns.
- **Dusk Connect** for wallet discovery and account connection in Dusk applications.
- **Dusk Trade** for product-level tokenized asset workflows such as onboarding, wallet connection, buying, selling, and settlement coordination.

If you want to understand the product layer, start with [Dusk Trade](/learn/dusk-trade). If you want the underlying regulated asset concepts, read [Assets & Regulations](/learn/deep-dive/assets-and-regulations).

## Read next

- [Dusk Trade](/learn/dusk-trade)
- [Native Issuance](/learn/tokenization-comparison)
- [Assets & Regulations](/learn/deep-dive/assets-and-regulations)
- [Core Components](/learn/core-components)
- [Build on Dusk](/developer/overview)
