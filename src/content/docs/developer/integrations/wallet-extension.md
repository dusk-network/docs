---
title: Dusk Wallet Extension
description: Use the Dusk Wallet browser extension as a first-party wallet for Dusk applications.
---

The Dusk Wallet extension is the first-party browser wallet for Dusk. It gives users a self-custodial wallet in Chrome and Firefox, and gives applications a provider surface for connecting Dusk accounts.

Use the extension when you need:

- a browser wallet for Dusk accounts
- public and shielded account flows
- mainnet, testnet, devnet, or custom node support
- dApp connection through Dusk provider discovery
- a first-party wallet to test Dusk Connect integrations

For users who only need a hosted browser wallet, see [Web Wallet](/learn/web-wallet). For terminal and operator workflows, see [Rusk Wallet](/learn/rusk-wallet).

## How it fits with Dusk Connect

Dusk Connect is the SDK layer for wallet discovery and account connection. The Dusk Wallet extension is one wallet provider that can be discovered through that flow.

A typical dApp flow is:

1. Use Dusk Connect or provider discovery to find available Dusk wallets.
2. Let the user choose the Dusk Wallet extension.
3. Request account access.
4. Ask the wallet to approve account actions or transactions when needed.

See [Dusk Connect](/developer/integrations/dusk-connect) for the SDK-level integration path.

If you are building the application side, start with Dusk Connect. If you are testing or documenting the wallet-provider side, use this page together with the wallet provider API.

## Provider discovery

The extension announces an EIP-1193-style provider through Dusk discovery events. Dusk is not an EVM chain, so wallet methods use Dusk-specific names.

```js
const providers = [];

window.addEventListener("dusk:announceProvider", (event) => {
  providers.push(event.detail);
});

window.dispatchEvent(new Event("dusk:requestProvider"));

const dusk = providers[0]?.provider;
const [account] = await dusk.request({ method: "dusk_requestAccounts" });

dusk.on("accountsChanged", console.log);
dusk.on("chainChanged", console.log);
```

For the canonical provider API, see the wallet repository:

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
- [Web Wallet](/learn/web-wallet)
