---
title: Dusk Wallet Integration
description: Connect applications to the official Dusk Wallet extension and its provider API.
---

This page is for developers integrating with or building the Dusk Wallet extension. For installation and user guidance, see [Wallets](/use/wallets/#dusk-wallet).

The Dusk Wallet extension is the first-party browser wallet for Dusk. It gives applications a provider surface for connecting Dusk accounts.

Use the extension when you need:

- a browser wallet for Dusk accounts
- public and shielded account flows
- mainnet, testnet, devnet, or custom node support
- dApp connection through Dusk provider discovery
- a first-party wallet to test Dusk Connect integrations

For a hosted browser wallet or terminal and operator workflows, see [Wallets](/use/wallets/).

## How it fits with Dusk Connect

Dusk Connect is the SDK layer for wallet discovery and account connection. The Dusk Wallet extension is one wallet provider that can be discovered through that flow.

A typical dApp flow is:

1. Use Dusk Connect or provider discovery to find available Dusk wallets.
2. Let the user choose the Dusk Wallet extension.
3. Request account access.
4. Ask the wallet to approve account actions or transactions when needed.

See [Dusk Connect](/developer/integrations/dusk-connect) for the SDK-level integration path.

If you are building the application side, start with Dusk Connect. If you are testing or documenting the wallet-provider side, use this page together with the wallet provider API.

## Connect from a dApp

Use `@dusk/connect` to discover the extension and request profile access. This also handles multiple compatible Dusk wallets without binding the application to this extension:

```js
import { createDuskWallet } from "@dusk/connect";

const wallet = createDuskWallet();
await wallet.ready();
const profiles = await wallet.connect();
```

See [Dusk Connect](/developer/integrations/dusk-connect/) for installation, provider selection, and application integration. The extension still exposes the lower-level Dusk provider API for wallet authors and specialized integrations:

- <a href="https://github.com/dusk-network/wallet/blob/main/docs/provider-api.md" target="_blank" rel="noreferrer">Dusk Wallet provider API</a>

## Install for development

The extension builds Chrome and Firefox targets from the same repository.

```bash
git clone https://github.com/dusk-network/wallet
cd wallet
npm install
```

For Chrome:

```bash
npm run build:chrome
```

Then load `dist/` as an unpacked extension in `chrome://extensions` with Developer mode enabled.

For Firefox:

```bash
npm run build:firefox
```

Then load `dist-firefox/` as a temporary add-on in `about:debugging`.

## Repository

- <a href="https://github.com/dusk-network/wallet" target="_blank" rel="noreferrer">dusk-network/wallet</a>

## Read next

- [Dusk Connect](/developer/integrations/dusk-connect)
- [Transaction Lifecycle](/developer/integrations/tx-lifecycle)
- [Wallets](/use/wallets/)
