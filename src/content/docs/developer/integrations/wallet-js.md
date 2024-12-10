---
title: Wallet JS Library
description: Use the dusk-wallet-js library to manage Dusk transactions within JavaScript environments.
---

The dusk-wallet-js uses the web assembly generated from [`wallet-core`](/developer/integrations/wallet-core) the web assembly is embedded in the npm package
that's released with the dusk-wallet-js

## API

```js
wallet.getBalance(): Promise
wallet.sync(): Promise
wallet.transfer(): Promise
wallet.stake(): Promise
wallet.unstake(): Promise
wallet.stakeInfo(): Promise
wallet.withdrawReward(): Promise
wallet.history(): Promise
wallet.reset(): Promise
```
(might change in the future)

The documentation of all the methods are written in jsdoc but they do exactly what the function name suggests. To instantiate a wallet instance

```js
const wallet = new Wallet(seed, gasLimit, gasPrice);
```

The seed is an array of 64 bytes max, to generate a seed, the user of the library is responsible for generating them correctly and pass them there.

> ##### To call any of the above functions, you need to be synced first, if you are not synced then the balance and other operations will fail!

To sync correctly, just call sync and wait before it completes

```js
walletInstance.sync().then(() => {
    // synced here, do other operations like calculating balance
    assertEquals(walletInstance.getBalance(psk), 200000000)
})
```

##### After the sync completes successfully, you are able to correctly call the wallet methods