---
title: Integrate with Exchanges
description: "Practical notes for listing DUSK: connectivity, deposits/withdrawals, and references."
---

## Integration Checklist

- Decide how you'll access the network:
  - Run your own node (recommended for production).
  - Use public endpoints (good for prototyping).
  - Run (or use) an archive node if you need address-based history queries.
- Support Moonlight (public) deposits and withdrawals.
- Handle finality and reverts: treat funds as final once the containing block is `finalized`, and re-process if a block is reverted.
- Use the memo field if you need per-user tagging.

## Network Access

Base URLs:

- **Mainnet:** `https://nodes.dusk.network`
- **Testnet:** `https://testnet.nodes.dusk.network`

GraphQL endpoint:

- `POST <base_url>/on/graphql/query`

For the full HTTP/WS API and event subscription model (RUES), see [/developer/integrations/http-api](/developer/integrations/http-api).

## Monitoring Deposits

Two common approaches:

- **Archive GraphQL (simplest):** poll `fullMoonlightHistory` or `moonlightHistory`. See [/developer/integrations/historical_events](/developer/integrations/historical_events).
- **Real-time (RUES):** subscribe to blocks/transactions and correlate with GraphQL `tx(hash: ...)` lookups.

## Submitting Withdrawals

- Use the [W3sper SDK](/developer/integrations/w3sper) to construct, sign, and broadcast transactions.
- Or broadcast raw bytes via `POST /on/transactions/propagate` (see the HTTP API page).

## GraphQL Quick Queries

Get the schema (SDL):

```sh
curl -s -X POST "https://nodes.dusk.network/on/graphql/query"
```

Transaction by hash:

```sh
curl -s -X POST "https://nodes.dusk.network/on/graphql/query" \
  --data-raw 'query { tx(hash: "<tx_hash>") { tx { id gasLimit gasPrice memo } err gasSpent blockHash blockHeight blockTimestamp } }'
```

Latest block header:

```sh
curl -s -X POST "https://nodes.dusk.network/on/graphql/query" \
  --data-raw 'query { block(height: -1) { header { height hash timestamp } } }'
```

## Transaction Model Notes

- Exchanges typically only need Moonlight (public) accounts. Phoenix (shielded) addresses are incompatible with Moonlight transfers.
- Users can convert shielded funds to public balances themselves before depositing to an exchange.

## Cold Storage

The [multisig contract](https://github.com/dusk-network/multisig-contract) contains a working example of multi-signature transfers for cold storage.

## Token Details

- Token: `dusk`
- Token decimals: `9` (18 decimals for ERC20 / BEP20 versions)
- Consensus mechanism: Succinct Attestation

## Token Migration (If Applicable)

Users can migrate ERC20/BEP20 DUSK to native DUSK using the [migration contract](https://github.com/dusk-network/dusk-migration) and the [Web Wallet](https://wallet.dusk.network/).

More information: [/learn/guides/mainnet-migration](/learn/guides/mainnet-migration).

Current token contracts:

- ERC20: `0x940a2db1b7008b6c776d4faaca729d6d4a4aa551`
- BEP20: `0xb2bd0749dbe21f623d9baba856d3b0f0e1bfec9c`

## Resources

- [Whitepaper](https://dusk-cms.ams3.digitaloceanspaces.com/Dusk_Whitepaper_2024_4db72f92a1.pdf)
- [Audits](https://github.com/dusk-network/audits)
- [Block explorer](https://explorer.dusk.network/)
