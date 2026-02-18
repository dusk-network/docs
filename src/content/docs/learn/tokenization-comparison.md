---
title: Native Issuance
description: What native issuance means, how it differs from tokenization, and why it matters for regulated assets.
---

People often use “tokenization” to mean “putting an asset on a blockchain”. For regulated assets, it helps to be more precise because the lifecycle (issuance, custody, trading, settlement, reporting) determines what has to happen off-chain.

This page defines the terms and explains where **native issuance** fits in.

## Definitions

### Digitization

Digitization is moving an asset’s recordkeeping from paper/manual processes to digital systems (for example, dematerialized securities in a central registry). The asset lifecycle and intermediaries usually stay the same.

### Tokenization

Tokenization is issuing a token that represents an asset (or a claim on an asset). The token may be programmable and easier to integrate with apps, but regulated assets often still rely on existing custody/registry/settlement processes off-chain.

### Native issuance

Native issuance means the asset itself is created and managed **on-chain**: issuance, transfers, and (depending on the design) settlement happen on the ledger without needing to reconcile a “token” against a separate system of record.

### Digitization vs Tokenization vs Native Issuance
Here’s a quick comparison:

|                      | **Digitization**                                                      | **Tokenization**                                                    | **Native Issuance**                                                |
|---------------------------------|----------------------------------------------------------------------|--------------------------------------------------------------------|--------------------------------------------------------------------|
| **Definition**                  | Conversion of paper-based systems into a digital format                   | Creation of a synthetic asset representing an underlying asset | Assets created directly on-chain without needing an underlying asset |
| **Functionality**               | Basic digital representation, no added functionality                  | Fractionalization and Programmability (Smart Contracts) | Full asset lifecycle on-chain with no reconciliation requirements  |
| **Settlement Process**          | Relies on traditional systems like CSDs and clearinghouses             | Relies on traditional systems like CSDs and clearinghouses             | Instant on-chain settlement, no reliance on external systems        |
| **Custody**                     | Custodial (assets held by third-party)                               | Custodial (underlying asset held by a third-party)                     | Non-custodial, asset exists fully on-chain                          |
| **Efficiency**                  | Inefficient due to reliance on intermediaries and slow settlement      | Some efficiency improvements but still faces reconciliation delays and costs   | High efficiency with near-instant settlement and reduced costs   |
| **Risk of Settlement Failure**   | Yes, due to manual reconciliation and intermediary involvement       | Yes, due to manual reconciliation and intermediary involvement                 | No, as settlement is on-chain                    |
| **Innovation Level**            | Zero. This is how things work now                  | Low. It only introduces fractionalization and partial programmability              | High. It removes intermediaries and enables fully on-chain processes    |

## Where Dusk fits

Dusk is built for regulated markets where **privacy, compliance controls, and deterministic settlement** are requirements, not add-ons.

In practice, that means you can:

- build applications and tokenization-style workflows with familiar EVM tooling (via **DuskEVM**), and
- rely on the settlement layer (**DuskDS**) for privacy-capable transaction models and finality.

If you want the architectural overview next, see [Core Components](/learn/core-components). For the product and market framing, see [Overview](/learn/overview).
