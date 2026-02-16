---
title: Integrate with Exchanges
description: Add $DUSK to your exchanges. Discover the integration process, technical requirements, and support resources.
---

# Introduction

This guide shows how to add DUSK to an Exchange by providing all the relevant information. In the first section we outline general details regarding mainnet integration and token migration. We will then look into what are the available libraries and APIs to access and interact with the blockchain, as well as providing links to all the relevant resources, and addressing some common requests.

## Connect to Dusk

To access the blockchain you can either:
- Spin up a node (query data, submit transactions, provide APIs)
- Use Dusk APIs (events system, HTTP ...)
- Use RPC providers

### Spin up a node

You can interact with the blockchain and submit transactions by operating a Dusk node.

To set up a node, you may choose to use the [node installer](/operator/provisioner#node-installer) (recommended) or manually install Rusk by following the provided [installation instructions](https://github.com/dusk-network/rusk/blob/master/INSTALLATION.md).

Requirements vary depending on whether you are configuring a [Provisioner](/operator/provisioner) node or an [Archive](/operator/archive-node) node.

### Use Dusk APIs

Dusk offers a streamlined event system through the [Rusk Universal Event System (RUES)](/developer/integrations/http-api), as data can be fetched from the following endpoints:

- **Mainnet**: https://nodes.dusk.network/
- **Testnet**: https://testnet.nodes.dusk.network/

These links also provide access to archive-related endpoints for comprehensive historical data retrieval.


### Use RPC providers

You can rely on the RPC infrastructure hosted by the community, or run an [archive node](/operator/archive-node) yourself.

## Token deposits and withdrawals

To monitor deposit and withdrawal events, you can utilize [RUES](/developer/integrations/http-api#event-subscriptions) by subscribing via a websocket.

In most cases, 1 block confirmation is sufficient for finality. The only exception to the 1 block finality is when the network is in a rolling finality state, in which up to 5 additional blocks may be required to achieve finality.

You can find a detailed overview of the full transaction lifecycle [here](/developer/integrations/tx-lifecycle).

## Construct, sign and decode transactions

The [W3sper SDK](/developer/integrations/w3sper) provides address generation, transaction building, signing, and decoding functionalities. It can operate completely offline, without the need for an online wallet or node.

## Memo field support

Dusk transactions also support a memo field, allowing exchanges to attach a short reference to each transaction. This is particularly useful for labeling deposits or withdrawals with user identifiers or order references.

## cURLs

In this section you can find some examples to retrieve information via cURLs.

### Schema Overview

You can explore the GraphQL schema by making a POST request:

```sh
curl -s --location --request POST "https://nodes.dusk.network/on/graphql/query"
```

To see available queries, you can look at the Query type, which lists all callable fields when making a request like:

```sh
--data-raw 'query { ... }'
```

### Retrieve Transaction Details by Hash

```bash
curl -s --location --request POST "https://nodes.dusk.network/on/graphql/query" \
--data-raw 'query { tx(hash: "59a20ebc71c198eeb7ac2ac55165d26f96b6a9884cebee8575be4e429a56c443") { tx { id, gasLimit, gasPrice, txType, callData { contractId, fnName, data }, isDeploy, memo } err, gasSpent, blockHash, blockHeight, blockTimestamp, id, raw } }'
```

### Retrieve Block Information by Block Height

```bash
curl -s --location --request POST "https://nodes.dusk.network/on/graphql/query" \
--data-raw 'query { block(height: 1000) { header { hash, gasLimit, height, prevBlockHash, seed, stateHash, timestamp, version } } }'
```

### Retrieve Latest Block

```bash
curl -s --location --request POST "https://nodes.dusk.network/on/graphql/query" \
--data-raw 'query { blocks(last: 1) { header { hash, gasLimit, height, prevBlockHash, seed, stateHash, timestamp, version } } }'
```
## Cold Storage Method

The [multisig contract](https://github.com/dusk-network/multisig-contract) contains an example of how to do multi-signature transfers, where only *N* out of *M* keys must sign a message to transfer DUSK to another account.

Users get to create accounts owned by multiple different BLS keys, where any important action must be signed (agreed upon) by some configurable portion of those keys.

## Compliance

Dusk is **fully compliant** with key global regulatory frameworks, providing robust adherence to financial and data protection standards:

- Market Abuse Regulations (MAR)
- Data Protection Regulations (GDPR)
- Anti-Money Laundering Directive (AMLD5)
- MiCA (Markets in Crypto-Assets Regulation)
- TFR (Transfer of Funds Regulation)

Dusk supports two distinct transaction models, which users can navigate between in a transparent way:
- [Phoenix](/learn/deep-dive/duskds-tx-models) enables confidential transactions while maintaining regulatory compliance
- [Moonlight](/learn/deep-dive/duskds-tx-models) is a completely transparent and auditable model.

Unlike traditional privacy coins, Dusk doesn't aim for full anonymity, but instead provides both privacy and regulatory compliance.


### Compliance in Moonlight (public)

[Moonlight](/learn/deep-dive/duskds-tx-models) is designed specifically for full transaction transparency, making it ideal for integration with exchanges and ensuring that:

- **CASPs** can easily meet compliance obligations under **AMLD5**, **MiCA**, and **TFR**.
- There is full support for **KYC**, transaction monitoring, and reporting requirements without any legal or technical barriers.

:::note[Important]
Exchanges **only** need to support the Moonlight transaction model.
:::

### Compliance in Phoenix (shielded)

Dusk features a **complete separation between public and shielded transaction models**. These models are built on distinct cryptographic foundations (with different address formats, lengths, and operational rules), ensuring clear boundaries between transparent and confidential transactions.

As a result, **shielded transactions cannot be sent to public addresses**, such as those used by exchanges. The address formats are incompatible by design, preventing accidental routing or unauthorized deposits across the two models. As long as exchanges do not share their shielded addresses, they are inherently isolated from receiving shielded deposits.

When using shielded transactions, it is important to know that they are not anonymous: **the sender's identity is always revealed to the receiver**. This provides full auditability within private transfers and reflects Dusk’s privacy-through-compliance design. When deciding to use and receive shielded transactions, the sender’s identity is always known, allowing an exchange to safely return funds to the rightful owner.

**Shielded funds can only be converted into public balances by the user themselves**. This conversion is cryptographically enforced through signature verification, meaning assets can only be unshielded to a public address the user controls. Furthermore, conversions are atomic and do not allow any other operation or action while a conversion is taking place. This means that a conversion transaction will always contain only the conversion and no contract call, transfer or other operation.

These design decisions serve an important compliance function:

- 🔄 Conversions are atomic, preserving state integrity between shielded and public balances.
- 🔐 Only the rightful owner can perform conversions between shielded and public balances, enforced via cryptographic proof.
- ❌ Shielded-to-public and public-to-shielded transfers are impossible: the two models are cryptographically separated at the protocol level.
- 🛡️ Exchanges are inherently protected from unauthorized or anonymous deposits, since shielded transactions cannot target public addresses.
- 🧾 Every shielded transaction reveals the sender’s identity to the receiver, ensuring full traceability.

This architecture makes Dusk fundamentally different from privacy coins, as they focus on full anonimity. Dusk is designed to offer privacy with accountability, enabling full compliance while preserving confidentiality when needed.


### Legal opinion
To reinforce confidence in compliance, there is a comprehensive and detailed **legal opinion** confirming adherence to applicable laws and regulations. This document is available for review upon request.


## Resources

- [Whitepaper](https://dusk-cms.ams3.digitaloceanspaces.com/Dusk_Whitepaper_2024_4db72f92a1.pdf)
- [Audits](https://github.com/dusk-network/audits)

### Libraries

- [W3sper SDK](/developer/integrations/w3sper)
- [RUES (events system)](/developer/integrations/w3sper)

### User-facing tools

- [Block explorer](https://explorer.dusk.network/)
- [Web Wallet](https://wallet.dusk.network/)

### Token details

- Token: `dusk`
- Token decimals: `9` (18 decimals for ERC20 / BEP20 versions)
- [Tokenomics and metrics](https://docs.dusk.network/learn/tokenomics)
- Consensus Mechanism: Succinct Attestation Consensus

## Q&As
### Status of Hardware Wallet Support

Hardware Wallet integration is a work in progress.

### Status of Custody Solution Support

Custodial integration is a work in progress.

### Cross-Chain Fees

For token migrations, the Dusk team covers the fees on the Dusk mainnet.
Users are responsible for the fees of Binance Smart Chain and Ethereum.


### Token Migration

Mainnet is now live, and users can still migrate from ERC20 DUSK and BEP20 DUSK to native DUSK by using the [migration contract](https://github.com/dusk-network/dusk-migration) to burn their tokens and release an equivalent amount of DUSK on the Dusk mainnet to the specified target address.

More information about the Mainnet migration can be found [here](/learn/guides/mainnet-migration).

Current token contracts are:
- ERC20 Contract Address: [0x940a2db1b7008b6c776d4faaca729d6d4a4aa551](https://etherscan.io/address/0x940a2db1b7008b6c776d4faaca729d6d4a4aa551)
- BEP20 Contract Address: [0xb2bd0749dbe21f623d9baba856d3b0f0e1bfec9c](https://bscscan.com/token/0xb2bd0749dbe21f623d9baba856d3b0f0e1bfec9c)

The [migration contract](https://github.com/dusk-network/dusk-migration) has been [audited](https://github.com/dusk-network/audits/blob/main/core-audits/2024-10_migration-smart-contract-security-assessment_zellic.pdf) and user's can bridge to the Dusk mainnet via the [Dusk Web Wallet](https://wallet.dusk.network/).
