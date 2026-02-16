---
title: Assets & Regulations
description: Background and references for regulated assets on Dusk.
---

This page is a short, docs-focused overview of common regulatory concepts that show up when building tokenized assets and other regulated flows.

If you're looking for implementation details, start here:
- [Digital Identity Protocol (Citadel)](/developer/digital-identity/protocol)
- [Transaction Models (Moonlight & Phoenix)](/learn/deep-dive/duskds-tx-models)

## MiCA (EU)

MiCA (Markets in Crypto-Assets Regulation) is the EU framework that sets requirements for:
- Crypto-asset issuers (including stablecoin categories like EMTs and ARTs)
- Crypto Asset Service Providers (CASPs)

:::note[Not legal advice]
This is a technical overview for builders. For requirements and interpretation, use official sources and qualified legal advice.
:::

**Official sources**
- ESMA’s MiCA hub: <a href="https://www.esma.europa.eu/esmas-activities/digital-finance-and-innovation/markets-crypto-assets-regulation-mica" target="_blank" rel="noreferrer">ESMA</a>
- Legal text: <a href="https://eur-lex.europa.eu" target="_blank" rel="noreferrer">EUR-Lex</a>

## Practical “Security Token” Lifecycle Requirements

Regardless of jurisdiction, regulated assets often imply a few recurring product requirements:
- **Access control**: only eligible parties can hold/transact (allowlists or identity/credential checks).
- **Transfer checks**: transfers fail with clear reasons, and (ideally) can be simulated/checked pre-flight.
- **Corporate actions**: dividends/coupons, burns, splits, and issuer-driven actions.
- **Recovery & remediation**: processes for lost keys, fraud response, and legally required actions.
- **Governance/voting**: snapshots and vote windows without double-counting.
- **Audit & reporting**: the ability to produce compliant reports without leaking unnecessary user data.

On Dusk, these concerns typically connect to identity/credentials (Citadel), smart contracts, and the dual transaction models (Moonlight for transparent flows and Phoenix for shielded flows).

## Dematerialization and CSDs (Concepts)

Dematerialization is the shift from paper certificates to electronic records of ownership. In traditional finance, Central Securities Depositories (CSDs) and associated market infrastructure manage issuance, custody, and settlement processes.

For many tokenization projects, the relevant takeaway is that “real-world” asset workflows often require more than transfers: role-based controls, recovery paths, and auditability tend to be first-class requirements.

