---
title: Native Issuance
description: What native issuance means, how it differs from tokenization, and why it matters for regulated digital assets.
---

People often use “tokenization” to mean “putting an asset on a blockchain”. For regulated assets, it helps to be more precise because the lifecycle (issuance, custody, trading, settlement, disclosure, reporting) determines what still has to happen outside the ledger.

This page defines the terms and explains where **native issuance** fits in.

## Definitions

### Digitization

Digitization is moving an asset’s recordkeeping from paper/manual processes to digital systems (for example, dematerialized securities in a central registry). The asset lifecycle and intermediaries usually stay the same.

### Tokenization

Tokenization is issuing a token that represents an asset (or a claim on an asset). The token may be programmable and easier to integrate with apps, but regulated assets often still rely on existing custody/registry/settlement processes off-chain.

### Native issuance

Native issuance means the asset itself is created and managed **on-chain**: issuance, transfers, servicing, and settlement can happen around the ledger instead of using a token as a wrapper around a separate system of record.

### Digitization vs Tokenization vs Native Issuance
Here’s a quick comparison:

|                      | **Digitization**                                                      | **Tokenization**                                                    | **Native Issuance**                                                |
|---------------------------------|----------------------------------------------------------------------|--------------------------------------------------------------------|--------------------------------------------------------------------|
| **Definition**                  | Conversion of paper-based systems into a digital format                   | Creation of a synthetic asset representing an underlying asset | Assets created directly on-chain without needing an underlying asset |
| **Functionality**               | Digital recordkeeping, often without changing the market workflow | Programmability around a representation of the asset | Asset lifecycle can be designed directly around on-chain workflows |
| **Settlement Process**          | Relies on traditional systems like CSDs and clearinghouses | Often still relies on traditional systems or reconciliation | Settlement can happen on-chain with deterministic finality |
| **Custody**                     | Usually custodial or registry-based | Often custodial because the underlying asset remains elsewhere | Can reduce reliance on separate custody and registry layers, depending on the legal structure |
| **Efficiency**                  | Limited by existing intermediaries and settlement processes | Improves distribution and programmability, but may keep reconciliation overhead | Can reduce handoffs between issuance, transfer, servicing, and settlement |
| **Operational Risk**            | Manual processes and reconciliation can create delays or errors | Reconciliation between token and underlying asset remains important | Fewer duplicated records when the asset workflow is natively on-chain |
| **Innovation Level**            | Incremental operational improvement | Better distribution and composability | Market workflow redesign around issuance, access controls, disclosure, and settlement |

## Where Dusk fits

Dusk is built for regulated markets where **access controls, privacy with selective disclosure, and deterministic settlement** are requirements, not add-ons.

In practice, that means you can:

- build applications and tokenization-style workflows with familiar EVM tooling through **DuskEVM**, and
- rely on **DuskDS**, the Dusk L1, for privacy-capable transaction models, data availability, and deterministic finality.

If you want the architectural overview next, see [Core Components](/learn/core-components). For the product and market framing, see [Overview](/learn/overview).
