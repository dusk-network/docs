---
title: Explorers
description: Find official and community explorers for Dusk mainnet and testnet.
---

Explorers let you inspect public network data such as blocks, transactions, contracts, provisioners, fees, and gas usage.

## Official explorers

| Network | Explorer |
|---|---|
| Dusk mainnet | [explorer.dusk.network](https://explorer.dusk.network/) |
| Dusk testnet | [explorer.testnet.dusk.network](https://explorer.testnet.dusk.network/) |

The explorer used to live at `apps.dusk.network/explorer` and `apps.testnet.dusk.network/explorer`. Those addresses now redirect to `explorer.dusk.network` and `explorer.testnet.dusk.network`.

## Community explorers

[DuskScan](https://duskscan.net/) is a community-operated mainnet explorer. It is not operated by Dusk. Community explorers may expose different indexes, labels, statistics, or wallet integrations, so verify important information against an official endpoint when needed.

## What explorers can show

Dusk is a privacy-preserving blockchain. Privacy-preserving [Phoenix](/learn/deep-dive/duskds-tx-models) transactions do not expose the sender, receiver and amount transferred to anyone other than the involved parties (sender, receiver, and users with the view key).

For public [Moonlight](/learn/deep-dive/duskds-tx-models) transactions or other types of chain interactions, the visibility of transaction details depends on the contract implementation and whether developers use privacy technology like zero-knowledge proofs.

The explorer can show the transaction type and metadata such as payload, fee, and gas used (depending on the transaction model and contract).
