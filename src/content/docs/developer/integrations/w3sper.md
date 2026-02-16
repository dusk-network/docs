---
title: W3sper SDK
description: Use the Dusk toolkit to build, test, and deploy compliant dApps for regulated financial markets.
---

The  <a href="https://github.com/dusk-network/rusk/tree/master/w3sper.js" target="_blank">W3sper SDK</a> (*/ˈwɛs.pər/*) is a comprehensive toolkit of modules designed to facilitate the development of applications that interact seamlessly with the Dusk network.  W3sper ensures secure, flexible interactions directly within the user's environment, eliminating the need for installations.


It empowers developers to deploy not just smart contracts but also the complete user experience, including custom UIs for transaction generation and contract interaction. W3sper allows developers to obtain a rich expressiveness and a standard way to define the client UX.

The W3sper SDK includes the following core features:

- **Address & Account Management**: easily generate and manage user profiles and addresses, streamlining user onboarding and identity management.
- **Balance and Transaction Management**: check balances, create signed transactions, and manage gas effectively.
- **Event Subscription**: stay up-to-date with network events and access blockchain data in real-time.
- **Proof Management**: generate and delegate Zero Knowledge proofs.


## Implementation

The W3sper SDK is making use of WASM, and it is a JavaScript-based SDK designed for web applications, allowing for seamless integration with browser-based DApps:

<a href="https://github.com/dusk-network/rusk/tree/master/w3sper.js" target="_blank">**Use the W3sper SDK**</a>


## Examples


### Loading a WASM

W3sper relies on a wallet-core WASM driver.

- If you connect to a node via `Network.connect(...)`, W3sper loads the driver automatically from the node (`/static/drivers/`).
- For offline usage, you can load the driver from disk via `useAsProtocolDriver(...)`.

```js
import { Network } from "@dusk/w3sper";

// Connects to a node (loads the protocol driver automatically)
const network = await Network.connect("https://nodes.dusk.network");
```

The WASM file can be fetched from:

- **Mainnet:** https://nodes.dusk.network/static/drivers/wallet-core.wasm
- **Testnet:** https://testnet.nodes.dusk.network/static/drivers/wallet-core.wasm
- **Local node:** `http://<your-node-host>:8080/static/drivers/wallet-core.wasm`

This implies that while `getLocalWasmBuffer()` is needed for local execution, it’s not required for online transactions.

The below function loads a local wallet-core WASM file:

```js
const WASM_RELEASE_PATH = "./dusk_wallet_core.wasm"; // Adjust to your path

export function getLocalWasmBuffer() {
    if (typeof Deno !== "undefined") {
        return Deno.readFile(WASM_RELEASE_PATH);
    }
    return Promise.reject("Can't access file system");
}
```
:::note[Tip]
Using `getLocalWasmBuffer` is needed for **offline** profile generation. It is not needed when you connect to a node and let W3sper load the driver for you.
:::


### Load the protocol driver

Some examples depend on `ProfileGenerator`, which requires the protocol driver. If it's not loaded, you'll get the error:

`no protocol driver loaded yet. call 'load' first.`

By wrapping the logic inside `useAsProtocolDriver()`, you can ensure that the protocol driver stays in memory while profiles are being generated:

```js
import { ProfileGenerator, useAsProtocolDriver } from "@dusk/w3sper";

const seeder = () => crypto.getRandomValues(new Uint8Array(64));

await useAsProtocolDriver(await getLocalWasmBuffer()).then(async () => {
    const profiles = new ProfileGenerator(seeder);
    const defaultProfile = await profiles.default;
    console.log(defaultProfile.account.toString());
});
```

This ensures `ProfileGenerator` only runs when the protocol driver is available, preventing premature cleanup that would unload the WASM before profile generation is complete.


### Ensure that the seeder is correctly used

The seeder is an (async) function that returns a `Uint8Array`. Pass the function itself to `ProfileGenerator`:

```js
const profiles = new ProfileGenerator(seeder);
```

### Generate a profile using a BIP39 generated seed

_This code can be run in an offline environment_

#### Step 1: Install BIP39 library

```sh
npm install bip39
```

#### Step 2: Use BIP39 library to generate a 64-byte seed, then use it to generate a profile and output the default address and account

```js
import bip39 from "bip39";
import { ProfileGenerator } from "@dusk/w3sper";

// Generate a random mnemonic (uses crypto.randomBytes under the hood), defaults to 128-bits of entropy, then split this into an array of strings.
const mnemonic = bip39.generateMnemonic();

// Generate 64 byte seed from the mnemonic
const seeder = async () => Uint8Array.from(bip39.mnemonicToSeedSync(mnemonic));

// Instantiate ProfileGenerator
const profiles = new ProfileGenerator(seeder);

// Get the default profile
const defaultProfile = await profiles.default;

// Output the first generated (default) profile account as a string
console.log(defaultProfile.account.toString());

// You could write the output to a file or into storage depending on your needs.
```


### Create transaction

_This code can be run in an offline environment_

```js
import { Network, Transfer } from "@dusk/w3sper";

// Assumes you already have `defaultProfile` from the ProfileGenerator examples above.
const amount = 77n; // Example (arbitrary) amount
const to = "oCqYsUMRqpRn2kSabH52Gt6FQCwH5JXj5MtRdYVtjMSJ73AFvdbPf98p3gz98fQwNy9ZBiDem6m9BivzURKFSKLYWP3N9JahSPZs9PnZ996P18rTGAjQTNFsxtbrKx79yWu"; // Example public key
const nonce = 22n; // Example (arbitrary) nonce
const gas = { limit: 500_000_000n }; // Example (sensible) gas limit

const transfer = new Transfer(defaultProfile) // defaultProfile can be the same as we generated earlier
    .amount(amount)
    .to(to)
    .nonce(nonce)
    .chain(Network.LOCALNET)
    .gas(gas)
    .build();

console.log(transfer);

// You could write the transfer object to a file or into storage depending on your needs.
```

### Execute transaction

_This code needs to be run in an internet connected environment_

```js
import { Network, Transfer } from "@dusk/w3sper";

// Connect to a node (using testnet for this example, but it could be any valid node)
const network = await Network.connect("https://testnet.nodes.dusk.network/");

// We will use the transfer object we created above. In a real-world application you would need to retrieve this from a file or out of storage...

// Execute the transaction, propagating to the network
const { hash } = await network.execute(transfer);

// Wait for the response from the network with the hash of the transaction we just executed
const evt = await network.transactions.withId(hash).once.executed();

// Get the gas paid for the transaction
const gasPaid = evt.gasPaid;

// Output the transaction hash
console.log({ hash });

// Output the gas paid (value in lux)
console.log({ gasPaid });
```

### Get a balance

_This code needs to be run in an internet connected environment_

```js
import { AccountSyncer, Network } from "@dusk/w3sper";

// We're using the network here to get the balance of a public key
const network = await Network.connect("https://testnet.nodes.dusk.network");

// Example public key
const publicKey =
	"ocXXBAafr7xFqQTpC1vfdSYdHMXerbPCED2apyUVpLjkuycsizDxwA6b9D7UW91kG58PFKqm9U9NmY9VSwufUFL5rVRSnFSYxbiKK658TF6XjHsHGBzavFJcxAzjjBRM4eF";

// Get the balance of public key.
const [balance] = await new AccountSyncer(network).balances([publicKey]);

// Disconnect from the network now that we have a balance
await network.disconnect();

// Output the balance object (`{ nonce: <BigInt>, value: <BigInt> }`)
console.log(balance);
```

### Get transaction details

_This code needs to be run in an internet connected environment_

```js
import { Network } from "@dusk/w3sper";

const network = await Network.connect("https://testnet.nodes.dusk.network");
const TX_ID =
	"f8bbede502df102d1d3208297193654386fe0c5c66a969234320bbb0d646905a"; // Replace with the transaction ID you want to look up.
const query = `tx(hash: "${TX_ID}") {
    tx {
      id
      gasLimit
      gasPrice
      txType
      callData {
        contractId
        fnName
        data
      }
      isDeploy
      memo
    }
    err
    gasSpent
    blockHash
    blockHeight
    blockTimestamp
    id
    raw
  }`;
const transactionInfo = await network.query(query);

console.log(transactionInfo);

await network.disconnect();
```

### Get network block height

_This code needs to be run in an internet connected environment_

```js
import { Network } from "@dusk/w3sper";

const network = await Network.connect("https://testnet.nodes.dusk.network");
const blockHeight = await network.blockHeight;

console.log(blockHeight);

await network.disconnect();
```

### Convert between DUSK and LUX units

_This code can be run in an offline environment_


```js
import { lux } from "@dusk/w3sper";

// Converting from LUX to DUSK (BigInt to string representation)
console.log(lux.formatToDusk(1n));                 // "0.000000001"
console.log(lux.formatToDusk(1_000_000_000n));     // "1" -> Exactly one DUSK
console.log(lux.formatToDusk(1_234_567_890_123n)); // "1234.567890123"

// Demonstrating large and fractional conversions
console.log(lux.formatToDusk(9_007_199_254_740_993n)); // "9007199.254740993"

// Converting back from DUSK (string to BigInt representation)
console.log(lux.parseFromDusk("0.000000001"));          // 1n 
console.log(lux.parseFromDusk("1"));                    // BigInt(1e9)
console.log(lux.parseFromDusk("1234.567890123"));       // 1_234_567_890_123n
console.log(lux.parseFromDusk("9007199.254740993"));    // 9_007_199_254_740_993n
```
