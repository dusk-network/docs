---
title: Dusk Connect
description: Connect Dusk applications to compatible wallet extensions with @dusk/connect.
---

Dusk Connect (`@dusk/connect`) is the wallet integration layer for browser dApps on Dusk. It discovers compatible wallet extensions, requests profile access, tracks the active wallet and network, and sends user-approved transactions through the selected wallet.

The SDK is framework-agnostic, typed, and has no runtime dependencies. An optional modal and `<dusk-connect-button>` are available from `@dusk/connect/ui`.

## Install

Dusk Connect is published on JSR:

```bash
npx jsr add @dusk/connect
```

For Deno:

```bash
deno add jsr:@dusk/connect
```

## Connect a wallet

`createDuskWallet()` starts wallet discovery and exposes a reactive view of the connection:

```js
import { createDuskWallet } from "@dusk/connect";

const wallet = createDuskWallet();
await wallet.ready();

if (wallet.state.availableProviders.length > 1 && !wallet.state.providerId) {
  await wallet.selectProvider(wallet.state.availableProviders[0].uuid);
}

const profiles = await wallet.connect();
console.log(profiles[0]);
```

`wallet.connect()` opens the selected wallet's approval flow. The wallet state updates when the user changes profile, account access, or network. Use `wallet.subscribe()` to update application state reactively.

## Where it fits

Use Dusk Connect for user-facing wallet flows:

- discover one or more compatible wallet extensions
- let the user select a wallet and grant profile access
- access public accounts and request shielded receive addresses
- request message signatures and user-approved transactions
- react to profile, authorization, and network changes

For a native smart-contract dApp, `createDuskApp()` adds read-only contract calls, data-driver loading, and prepared contract writes to the same wallet connection. Use [W3sper](/developer/integrations/w3sper/) or the [HTTP API](/developer/integrations/http-api/) when an application or backend needs direct node access without an injected wallet.

The [Dusk Wallet Extension](/developer/integrations/wallet-extension/) is the first-party wallet provider for testing this flow. Dusk Connect uses the Dusk discovery protocol instead of hardcoding a particular extension.

## Next steps

- [Dusk Connect repository and API reference](https://github.com/dusk-network/connect)
- [Dusk Wallet Extension](/developer/integrations/wallet-extension/)
- [Transaction Lifecycle](/developer/integrations/tx-lifecycle/)
- [W3sper SDK](/developer/integrations/w3sper/)
