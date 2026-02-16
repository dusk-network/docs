---
title: W3sper SDK
description: JavaScript SDK for generating profiles, building transactions, and querying Dusk nodes.
---

W3sper (`@dusk/w3sper`) is the JavaScript SDK used by Dusk apps and tooling to interact with nodes.

## Install

```sh
npm install @dusk/w3sper
```

## Connect

```js
import { Network } from "@dusk/w3sper";

const network = await Network.connect("https://testnet.nodes.dusk.network");
console.log(await network.node.info);
```

## Generate a Profile

A seeder is an (async) function that returns a `Uint8Array` (64 bytes).

```js
import { ProfileGenerator } from "@dusk/w3sper";

const seeder = () => crypto.getRandomValues(new Uint8Array(64));
const profiles = new ProfileGenerator(seeder);

const me = await profiles.default;

// Moonlight (public) account (Base58, 96 bytes)
console.log(me.account.toString());

// Phoenix (shielded) address (Base58, 64 bytes)
console.log(me.address.toString());
```

## Get a Balance (Moonlight)

```js
import { AccountSyncer } from "@dusk/w3sper";

const [balance] = await new AccountSyncer(network).balances([me]);
console.log(balance); // { nonce: bigint, value: bigint } (value in LUX)
```

## Send a Transfer (Moonlight)

Amounts are in `LUX` (`1 DUSK = 1_000_000_000 LUX`).

```js
import { Transfer } from "@dusk/w3sper";

const to = "<receiver_moonlight_account>";
const txBuilder = new Transfer(me).amount(1_000_000_000n).to(to);

const { hash } = await network.execute(txBuilder);
await network.transactions.withId(hash).once.executed();

console.log({ hash });
```

## Query GraphQL

`network.query()` wraps your selection in `query { ... }` and calls the node GraphQL endpoint.

```js
const tip = await network.query("block(height: -1) { header { height hash } }");
console.log(tip.block.header);
```

## Offline Mode (Optional)

When you call `Network.connect(...)`, W3sper loads the wallet-core WASM driver from the node (`/static/drivers/`).
For offline usage, load the driver yourself:

```js
import { ProfileGenerator, useAsProtocolDriver } from "@dusk/w3sper";

async function getLocalWasmBuffer() {
  // Must return bytes (Uint8Array/ArrayBuffer). Adjust to your environment.
  return Deno.readFile("./wallet-core.wasm");
}

const seeder = () => crypto.getRandomValues(new Uint8Array(64));

await useAsProtocolDriver(await getLocalWasmBuffer()).then(async () => {
  const profiles = new ProfileGenerator(seeder);
  const me = await profiles.default;
  console.log(me.account.toString());
});
```

WASM download URLs:

- Mainnet: `https://nodes.dusk.network/static/drivers/wallet-core.wasm`
- Testnet: `https://testnet.nodes.dusk.network/static/drivers/wallet-core.wasm`

## Units

```js
import { lux } from "@dusk/w3sper";

console.log(lux.formatToDusk(1_000_000_000n)); // "1"
console.log(lux.parseFromDusk("0.5"));         // 500_000_000n
```
