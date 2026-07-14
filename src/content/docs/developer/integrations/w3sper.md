---
title: W3sper SDK
description: Query Rusk nodes and use lower-level Dusk profile, synchronization, and transaction primitives from JavaScript.
---

W3sper (`@dusk/w3sper`) is the JavaScript client for direct access to Rusk nodes. It covers node queries, account and shielded-state synchronization, data-driver based contract reads, and the lower-level primitives used by applications that manage their own wallet state.

Use [Dusk Connect](/developer/integrations/dusk-connect/) instead when a browser dApp should discover a wallet extension and ask the user to approve access or transactions. Use the [HTTP API and RUES reference](/developer/integrations/http-api/) for raw or non-JavaScript integrations.

## Install

```sh
deno add jsr:@dusk/w3sper
```

## Connect and query

`Network.connect()` opens the RUES connection and loads the protocol driver required by profile and transaction APIs.

```js
import { Network } from "@dusk/w3sper";

const network = await Network.connect("https://testnet.nodes.dusk.network");

try {
  const info = await network.node.info;
  const height = await network.blockHeight;

  console.log({ version: info.version, chain: String(info.chain), height });
} finally {
  await network.disconnect();
}
```

## Read a public balance

`AccountSyncer` accepts a Moonlight account string; reading a balance does not require its private key.

```js
import { AccountSyncer, Network, lux } from "@dusk/w3sper";

const account = "<MOONLIGHT_ACCOUNT>";
const network = await Network.connect("https://testnet.nodes.dusk.network");

try {
  const [balance] = await new AccountSyncer(network).balances([account]);
  console.log(lux.formatToDusk(balance.value));
} finally {
  await network.disconnect();
}
```

Balances and transaction amounts are represented in `LUX`: `1 DUSK = 1_000_000_000 LUX`.

## Query a DuskVM contract

Forge builds a data-driver WASM artifact alongside each DuskVM contract. Serve that artifact with your application, register its URL under the deployed contract ID, and W3sper uses it to encode calls and decode results:

```js
import { Contract, Network } from "@dusk/w3sper";

const contractId = "<CONTRACT_ID>";
const network = await Network.connect("https://testnet.nodes.dusk.network");

network.dataDrivers.register(contractId, "/drivers/dusk_counter.wasm");

const counter = new Contract({
  contractId,
  driver: network.dataDrivers.get(contractId),
  network,
});

try {
  console.log(await counter.call.get_count());
} finally {
  await network.disconnect();
}
```

The driver in this example is the file produced at `target/data-driver/wasm32-unknown-unknown/release/dusk_counter.wasm` by the [DuskVM quickstart](/developer/duskvm/quickstart/).

## Signing transactions directly

W3sper provides transaction builders, but it does not provide a complete application wallet. A client that signs without an extension must supply recoverable key storage and a synchronized treasury behind `Bookkeeper`, including public nonces and shielded notes.

Do not construct a transfer directly from a newly generated `Profile`: it has no synchronized `Bookkeeper` entry and the transaction cannot obtain the required balance or nonce state. For browser dApps, let Dusk Connect and the selected wallet handle signing. For a headless wallet, start from the [W3sper source and tests](https://github.com/dusk-network/rusk/tree/master/w3sper.js) and implement the storage and synchronization boundary explicitly.

## Query GraphQL

`network.query()` wraps the selection in `query { ... }` and sends it to the node GraphQL endpoint:

```js
const tip = await network.query(
  "block(height: -1) { header { height hash } }",
);

console.log(tip.block);
```

## Offline profile derivation

`Network.connect()` loads the protocol driver expected by the installed W3sper release from the selected node. `@dusk/w3sper` 1.6.0 requests `wallet-core-1.6.0.wasm`. An offline application must download that exact driver, store it locally, and load it before using profile APIs:

```js
import { ProfileGenerator, useAsProtocolDriver } from "@dusk/w3sper";

const driver = await Deno.readFile("./wallet-core-1.6.0.wasm");
const seeder = () => crypto.getRandomValues(new Uint8Array(64));

await useAsProtocolDriver(driver);

const profiles = new ProfileGenerator(seeder);
const profile = await profiles.default;
console.log(profile.account.toString());
```

The random seed above is only an API demonstration. Production applications must use protected, recoverable key material and must never log or expose it.

Driver URLs:

- Mainnet: `https://nodes.dusk.network/static/drivers/wallet-core-1.6.0.wasm`
- Testnet: `https://testnet.nodes.dusk.network/static/drivers/wallet-core-1.6.0.wasm`

Check the installed W3sper release before pinning an offline driver; the filename changes when its protocol-driver dependency changes.

## Next steps

- [Dusk Connect](/developer/integrations/dusk-connect/)
- [DuskVM quickstart](/developer/duskvm/quickstart/)
- [Moonlight deposit scanning](/developer/integrations/historical_events/)
- [Transaction lifecycle](/developer/integrations/tx-lifecycle/)
- [HTTP API and RUES](/developer/integrations/http-api/)
