---
title: Dusk Connect
description: Integrate Dusk wallet discovery and account connection into applications.
---

Dusk Connect is the wallet integration layer for Dusk applications. It gives dApps a consistent way to discover compatible wallets, request accounts, and build connection flows around Dusk accounts.

Use Dusk Connect when your application needs to:

- detect compatible Dusk wallet providers
- let users select a wallet
- request account access
- handle public and shielded account flows in a consistent UI
- integrate with Dusk wallet software without hardcoding one provider

## Where it fits

Dusk applications often need two kinds of integration:

- **Network integration**: read chain data, submit transactions, and observe events.
- **Wallet integration**: ask a user to connect an account and approve actions.

Dusk Connect is for the wallet side. For network APIs and transaction flow, see [Transaction Lifecycle](/developer/integrations/tx-lifecycle), [HTTP API](/developer/integrations/http-api), and [W3sper SDK](/developer/integrations/w3sper).

## Typical flow

A dApp integration usually follows this shape:

1. Discover available Dusk wallet providers.
2. Show the user the compatible wallets.
3. Request account access from the selected wallet.
4. Store the active account and provider for the session.
5. Ask the wallet to approve transactions or account actions when needed.

The exact API depends on the version of Dusk Connect you integrate.

## Repository

The Dusk Connect SDK is developed in the Dusk Network GitHub organization:

- <a href="https://github.com/dusk-network/connect" target="_blank" rel="noreferrer">dusk-network/connect</a>

## Read next

- [Web Wallet](/learn/web-wallet)
- [Transaction Lifecycle](/developer/integrations/tx-lifecycle)
- [W3sper SDK](/developer/integrations/w3sper)
