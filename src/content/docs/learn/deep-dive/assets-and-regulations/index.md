---
title: Assets & Regulations
description: Background and implementation concepts for regulated assets on Dusk.
---

This page is a docs-focused overview of common regulatory and product concepts that show up when building tokenized assets, native issuance workflows, and other regulated financial applications on Dusk.

If you're looking for implementation details, start here:
- [Digital Identity Protocol (Citadel)](/developer/digital-identity/protocol)
- [Transaction Models (Moonlight & Phoenix)](/learn/deep-dive/duskds-tx-models)
- [Market Infrastructure on Dusk](/learn/market-infrastructure)
- [Dusk Trade](/learn/dusk-trade)

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

## Practical regulated asset requirements

Regardless of jurisdiction, regulated assets often imply a few recurring product requirements:

- **Access control**: only eligible parties can hold/transact (allowlists or identity/credential checks).
- **Transfer checks**: transfers fail with clear reasons and can be simulated or checked before submission.
- **Corporate actions**: dividends/coupons, burns, splits, and issuer-driven actions.
- **Recovery & remediation**: processes for lost keys, fraud response, and legally required actions.
- **Governance/voting**: snapshots and vote windows without double-counting.
- **Audit & reporting**: the ability to produce compliant reports without leaking unnecessary user data.
- **Settlement coordination**: asset and payment legs need to settle predictably.

On Dusk, these concerns typically connect to identity/credentials (Citadel), smart contracts, and the dual transaction models (Moonlight for transparent flows and Phoenix for shielded flows).

## Access controls

Access controls answer questions such as:

- Who is allowed to hold this asset?
- Who is allowed to receive it?
- Which transfers should fail?
- Which rules apply to a venue, jurisdiction, or asset class?

On Dusk, access-control patterns can be implemented with identity credentials, wallet binding, smart contract logic, and application-level checks. The exact design depends on the legal and product requirements of the asset.

## Privacy with selective disclosure

Regulated markets need privacy, but they also need evidence.

Examples:

- an investor should not expose every balance or transfer to every market participant
- an issuer may need visibility into specific ownership or eligibility data
- a supervisor, venue, or auditor may need controlled disclosure for a defined purpose

Dusk’s privacy model supports this direction through shielded transfers, zero-knowledge proofs, and selective disclosure patterns.

## Settlement and servicing

Regulated assets usually require more than a transfer:

- primary issuance
- secondary market transfers
- settlement against a payment leg
- corporate actions
- investor updates
- reporting and audit trails

DuskDS provides deterministic finality and native transaction models. Applications can use DuskEVM or native Dusk contracts depending on whether the workflow needs EVM compatibility, native execution, or closer integration with Dusk’s transaction models.

## Dematerialization and CSDs (Concepts)

Dematerialization is the shift from paper certificates to electronic records of ownership. In traditional finance, Central Securities Depositories (CSDs) and associated market infrastructure manage issuance, custody, and settlement processes.

For many tokenization projects, the relevant takeaway is that “real-world” asset workflows often require more than transfers: role-based controls, recovery paths, servicing, reporting, and auditability tend to be first-class requirements.

## Read next

- [Dusk Trade](/learn/dusk-trade)
- [Native Issuance](/learn/tokenization-comparison)
- [Market Infrastructure on Dusk](/learn/market-infrastructure)
- [Digital Identity Protocol](/developer/digital-identity/protocol)
