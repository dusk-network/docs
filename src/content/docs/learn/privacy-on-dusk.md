---
title: Privacy on Dusk
description: Explore Dusk's privacy capabilities, privacy-preserving smart contracts, and selective disclosure for regulated onchain finance.
---

Dusk provides privacy-preserving infrastructure for regulated onchain finance. Its privacy capabilities protect transaction details and personal information while supporting verification and selective disclosure.

## Privacy capabilities

| Component | What it provides |
| --- | --- |
| [Phoenix](/learn/deep-dive/duskds-tx-models/) | Shielded DUSK balances and transfers, using encrypted notes and zero-knowledge proofs to verify transactions without exposing private transfer details. |
| [Hedger](https://dusk.network/news/hedger-confidential-duskevm) | Confidential asset ownership, balances, and transfer amounts for DuskEVM applications, with support for authorized auditing. |
| [Citadel 2](/developer/digital-identity/protocol/) | Private credentials that let users prove possession of a valid license without publishing personal attributes or revealing which license they used. |
| [XSC](https://dusk.network/use-cases/confidential-security-tokens) | A confidential security-contract standard for tokenized securities, combining privacy with asset-specific eligibility and transfer rules. |

## Privacy-preserving smart contracts

Privacy-preserving smart contracts can verify rules and process financial actions while protecting the sensitive information involved.

[DuskVM](/learn/deep-dive/dusk-vm/) supports Rust/WASM contracts that use Dusk L1 assets, transaction models, and zero-knowledge capabilities. XSC provides a standard for confidential securities with eligibility and transfer controls.

On [DuskEVM](/learn/dusk-evm/), applications use Solidity and familiar Ethereum tooling. Hedger provides confidential asset operations through encryption and zero-knowledge proofs.

The contract design determines which information remains private and which information is public. Deploying a contract does not automatically make its data confidential.

## Selective disclosure

Selective disclosure lets a user reveal specific information or prove a condition without exposing all underlying data.

Phoenix includes viewing capabilities for shielded information. Hedger supports authorized transaction auditing. Citadel 2 lets users prove credential possession and disclose information according to a service's requirements.

Each application defines who can access information and what that access covers.

## Common questions

### Is every Dusk transaction private?

No. Moonlight is the public transaction model, with visible balances and transfer details. Phoenix provides shielded transfers. Smart-contract privacy depends on the application's implementation.

### How can the network verify private information?

[Zero-knowledge proofs](/learn/cryptography/) demonstrate that a transaction or condition is valid without revealing the private inputs. For example, a shielded transfer can prove sufficient funds and prevent double spending without publishing the transferred amount.

### Can private activity still be audited?

Yes. Disclosure mechanisms can give authorized parties access to information that remains confidential to public observers. The scope depends on the protocol and application.

## Read next

- [Transaction models](/learn/deep-dive/duskds-tx-models/)
- [Cryptography](/learn/cryptography/)
- [DuskEVM](/learn/dusk-evm/)
- [Citadel 2](/developer/digital-identity/protocol/)
