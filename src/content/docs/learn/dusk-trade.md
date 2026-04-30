---
title: Dusk Trade
description: Where Dusk Trade fits in the Dusk stack and how it turns market infrastructure into tokenized asset workflows.
---

Dusk Trade is the application layer for tokenized financial assets on Dusk.

It sits above the base protocol and turns Dusk's market-infrastructure primitives into user-facing workflows: asset discovery, investor onboarding, wallet connection, payment coordination, trading actions, and settlement.

## What Dusk Trade is for

Dusk Trade is designed for regulated market workflows where assets are not just listed and transferred, but also need eligibility, disclosure, and settlement logic around them.

Typical flows include:

- discovering tokenized financial assets
- connecting a wallet
- completing onboarding or eligibility checks
- buying or selling an asset
- coordinating the asset leg and payment leg
- exposing the right information to issuers, venues, investors, or other authorized parties

## Where it fits in the stack

Dusk Trade is not the base protocol. It is a product layer that can use the Dusk stack underneath it.

| Layer | Role |
| --- | --- |
| **DuskDS** | Settlement, finality, data availability, native transaction models |
| **DuskEVM** | EVM-compatible application execution and Solidity tooling |
| **DuskVM** | Native Rust/WASM execution for Dusk-specific contracts |
| **Citadel** | Identity, credentials, and selective disclosure patterns |
| **Dusk Connect** | Wallet discovery and account connection |
| **Dusk Wallet Extension** | First-party browser wallet provider for Dusk applications |

The exact architecture depends on the product and regulatory requirements of the market being served.

## Why it matters

For regulated assets, the hard part is rarely a token contract in isolation. The hard part is the complete market workflow:

- who can access the asset
- who can hold or transfer it
- what information is public
- what information is confidential
- what can be selectively disclosed
- how payment and asset settlement are coordinated
- how issuers, venues, and investors interact with the same environment

Dusk Trade is where those requirements become a usable product surface.

## Read next

- [Market Infrastructure on Dusk](/learn/market-infrastructure)
- [Native Issuance](/learn/tokenization-comparison)
- [Assets & Regulations](/learn/deep-dive/assets-and-regulations)
- [Dusk Connect](/developer/integrations/dusk-connect)
- [Dusk Wallet Extension](/developer/integrations/wallet-extension)
