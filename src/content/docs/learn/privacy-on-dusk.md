---
title: Privacy on Dusk
description: How Dusk combines public and confidential flows, selective disclosure, and privacy-preserving infrastructure for regulated onchain finance.
---

Dusk is **privacy-preserving infrastructure for regulated onchain finance with selective disclosure**.

That does not mean every Dusk transaction or application is private by default. Dusk supports public accounts, shielded transfers, privacy-aware smart contracts, and selective-disclosure credentials so a workflow can expose what must be public while protecting information that should remain confidential.

**Status reviewed:** August 31, 2026.

## Privacy capabilities at a glance

| Capability | What it provides | Current availability |
| --- | --- | --- |
| **Moonlight** | Public, account-based DUSK balances and transfers | Live on Dusk mainnet |
| **Phoenix** | Shielded, note-based DUSK balances and transfers using zero-knowledge proofs | Live protocol capability; admission of new Phoenix transactions is temporarily paused pending a follow-up upgrade |
| **DuskVM** | Rust/WASM smart contracts that can use Dusk L1 assets, transaction models, and zero-knowledge capabilities | Live on Dusk mainnet |
| **DuskEVM** | Ethereum-compatible application execution; standard EVM activity is transparent unless an application adds privacy | Live and usable on the public DuskEVM testnet |
| **Hedger** | Confidential transaction flows for DuskEVM applications | Live on the public DuskEVM testnet |
| **Citadel 2** | Private credentials and selective disclosure for identity and access workflows | Live and usable |
| **XSC** | A confidential security-contract standard that can encode privacy and eligibility constraints | Live Dusk L1 technology |

“Live” describes an available capability. Where a capability is on testnet rather than mainnet, these docs say so explicitly.

## Public and shielded DUSK transfers

### Moonlight: public accounts

[Moonlight](/learn/deep-dive/duskds-tx-models/) is the transparent Dusk transaction model. Its account balances and transfer details are public. It is suitable for payments, treasury activity, exchange integrations, and other workflows where public observability is required or acceptable.

### Phoenix: shielded accounts

[Phoenix](/learn/deep-dive/duskds-tx-models/) is the shielded Dusk transaction model. It uses notes and zero-knowledge proofs to verify transfers without publishing the same balance, participant, and amount information exposed by a public account model.

Phoenix is not retired. It remains part of the live Dusk protocol and historical chain state. Admission of new Phoenix transactions is temporarily paused following the Boreas network upgrade and is intended to reopen in a follow-up upgrade. Moonlight remains available for new public transfers during the pause.

## Privacy in applications

Privacy on Dusk is broader than one transfer model.

- **DuskVM contracts** can implement privacy-preserving assets and workflows directly on the Dusk L1 using Rust, WebAssembly, and zero-knowledge capabilities.
- **DuskEVM applications** use familiar Solidity and EVM tooling. Ordinary EVM state and transactions are transparent unless the application introduces a privacy layer.
- **Hedger** provides a path for confidential transaction flows on DuskEVM.
- **XSC** provides a standard for confidential security contracts whose rules can be adapted to asset and eligibility requirements.

The exact visibility of a smart-contract workflow depends on its implementation. Deploying an application on Dusk does not automatically make every field or action confidential.

## Selective disclosure

Selective disclosure lets a user or application prove or reveal the information required for a particular purpose without exposing all underlying data publicly.

On Dusk, selective disclosure can appear in several forms:

- Phoenix viewing capabilities for authorized inspection of shielded activity;
- zero-knowledge proofs that demonstrate a condition without revealing the private inputs; and
- [Citadel 2](/developer/digital-identity/protocol/) credentials that prove relevant identity or eligibility attributes without publishing the complete credential onchain.

Selective disclosure is a technical capability, not an automatic legal conclusion. Each issuer, venue, application, or service provider remains responsible for the rules, disclosures, and controls its workflow requires.

## Common questions

### Is Dusk a privacy blockchain?

Dusk is best described as privacy-preserving infrastructure for regulated onchain finance with selective disclosure. It supports both public and confidential workflows instead of forcing one visibility model on every user and application.

### Is every Dusk transaction private?

No. Moonlight transactions are public. Phoenix is the shielded transfer model, and application-level privacy depends on the contracts and technologies a developer chooses to use.

### Is Phoenix retired?

No. Phoenix is live protocol technology, but admission of new Phoenix transactions is temporarily paused. Dusk plans to reopen it in a follow-up upgrade.

### Are DuskEVM and Hedger live?

Yes. DuskEVM and Hedger are live and usable on the public DuskEVM testnet. That availability should not be described as DuskEVM mainnet.

### Does Dusk automatically make an application compliant?

No. Dusk provides privacy, selective-disclosure, identity, execution, and settlement capabilities that applications can use. Compliance depends on the application design, the parties involved, and the applicable legal and regulatory requirements.

## Read next

- [DuskDS transaction models](/learn/deep-dive/duskds-tx-models/)
- [Cryptography on Dusk](/learn/cryptography/)
- [Dusk core components](/learn/core-components/)
- [Citadel 2](/developer/digital-identity/protocol/)
- [DuskEVM](/learn/dusk-evm/)
