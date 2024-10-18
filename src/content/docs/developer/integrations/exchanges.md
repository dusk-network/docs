---
title: Integrate with Exchanges
description: Add Dusk to an Exchange
---

# Introduction

This guide shows how to add DUSK to an Exchange by providing all the relevant information. In the first section we outline general details regarding the upcoming mainnet launch and token migration. We will then look into what are the available libraries and APIs to access and interact with the blockchan, as well as providing links to all the relevant resources, and addressing some common requests.

## Token Migration

Users will be able to migrate from ERC-20 DUSK and BEP-20 DUSK to native DUSK (`dusk`) by using the one-way bridge (burner contract) to burn their tokens and release an equivalent amount of `dusk` on the Dusk mainnet to the specified target address.

To ensure the integrity of cross-chain operations, the bridge is undergoing a comprehensive security audit. Eventually, the one-way migration bridge will evolve into a two-way Dusk <> EVM chains bridge.

The burner contract will be accessible from the [Dusk Wallet](https://wallet.dusk.network/).

Current token contracts are:
- ERC-20 Contract Address: [0x940a2db1b7008b6c776d4faaca729d6d4a4aa551](https://etherscan.io/address/0x940a2db1b7008b6c776d4faaca729d6d4a4aa551)
- BEP-20 Contract Address: [0xb2bd0749dbe21f623d9baba856d3b0f0e1bfec9c](https://bscscan.com/token/0xb2bd0749dbe21f623d9baba856d3b0f0e1bfec9c)

## Connect to Dusk

To access the blockchain you can either:
- Spin up a node (query data, submit transactions, provide APIs)
- Use Dusk APIs (events system, HTTP ...)
- Use RPC providers

### Spin up a node

You can access the blockchain and submit transactions by running a Dusk node. [Technical requirements](/operator/introduction/requirements#hardware) are quite light, and you can either [build from source](/operator/node-installation/build-from-source) or run a [Docker image](/operator/node-installation/docker-image).

### Use Dusk APIs

Dusk exposes the following APIs:
- [RUES](https://github.com/dusk-network/rusk/wiki/RUES-%28Rusk-Universal-Event-System%29): Provides an event system for streamlining information from the network.
- HTTP API (Work in Progress)
  
### Use RPC providers

You can rely on the RPC infrastructure hosted by the community.

## Token Deposits and Withdrawals

You can subscribe via websocket to deposit and withdrawal events using [RUES](https://github.com/dusk-network/rusk/wiki/RUES-%28Rusk-Universal-Event-System%29).

In most cases, 1 block confirmation is sufficient for finality. The only exception to the 1 block finality is when the network is in a rolling finality state, in which up to 5 additional blocks may be required to achieve finality.

## Construct, sign and decode transactions

The [w3sper SDK](https://github.com/dusk-network/rusk/wiki/%5BDraft%5D-W3sper-SDK) provides address generation, transaction building, signing, and decoding functionalities. It can operate completely offline, without the need for an online wallet or node. The w3sper SDK leverages [wallet-core](https://github.com/dusk-network/dusk-wallet-core) to facilitate offline transaction processing and signing, producing both the transaction hash and signed transaction outputs. The format for transaction serialization and decoding is called `duskbytes`.

## Resources
### Libraries

- [Wallet Stack](https://docs.dusk.network/developer/integrations/wallet-stack)
- [wallet-core](https://docs.dusk.network/developer/integrations/wallet-core)
- [w3sper (SDK)](https://github.com/dusk-network/rusk/wiki/%5BDraft%5D-W3sper-SDK)
- [RUES (events system)](https://github.com/dusk-network/rusk/wiki/RUES-%28Rusk-Universal-Event-System%29)

### Links

- [Block explorer](https://explorer.dusk.network/)
- [Web Wallet](https://wallet.dusk.network/)

### Token details

- Token: `dusk`
- Token decimals: `9` (18 decimals for ERC-20 / BEP-20 versions)
- [Tokenomics and metrics](https://docs.dusk.network/learn/tokenomics)
- Consensus Mechanism: [Succinct Attestation Consensus](https://docs.dusk.network/learn/deep-dive/succinct-attestation)

### Audits
- [Audits Reports](https://github.com/dusk-network/audits)
  
## Q&As
### Status of Hardware Wallet Support

Hardware Wallet integration is a work in progress.

### Screening tools

Screening tools integration is a work in progress.

### Cross-Chain Fees

For token migrations, the Dusk team will cover the fees on the Dusk mainnet.
Users are responsible for the fees of Binance Smart Chain and Ethereum.
