---
title: Wallet Core Library
description: Integrate with DuskDS Wallet-Core library to manage transactions.
---

This documentation explains how to use the <a href="https://github.com/dusk-network/rusk/tree/master/wallet-core" target="_blank">wallet-core</a> library from any programming language of your preference. 

`wallet-core`is used in a JS library for the web and a Rust library ([rusk-wallet](/learn/rusk-wallet)). They both serve as examples of how to use this library.

This wiki documents how to sign transactions or extend your own code to talk to the blockchain.

:::note[Note]
When calling any FFI functions, refer to the latest documentation for the argument types. Each function takes a JSON argument. Types are defined in `assets/schema.json`, and a `types.rs` file is generated accordingly.
:::

## Creating a transaction
Transaction creation happens via the [`execute`](https://github.com/dusk-network/wallet-core/blob/main/src/ffi.rs#L131) function in `wallet-core`. This returns the bytes for the unproven transaction, which we'll learn how to prove later on...

```js
 const output = {
    receiver: receiver,
    // if you want to hide the value of the transaction, could be "transparent"
    note_type: "Obfuscated",
    // ref id of the transaction
    ref_id: 1,
    value: amount,
};

const json = {
    "call": null,
    "crossover": null,
    "fee": null, 
    "inputs": ..., // they are the unspent notes which are persisted from the sync
    "output": output,
    "openings": ..., // fetched from the node, see rusk-wallet on how to do it
    "gas_limit": ...,
    "gas_price": ...,
    "refund": ...,
    "rng_seed": [...], // random bytes
    "sender_index": 0, // the key index of the sender of the transactions
    "seed": [...], // seed bytes of the user who is sending the transaction
}

const bytes = call_execute(wasm, json);
```

This gives out the bytes of the unproven transaction, before proving that, let's call a more complicated method, like `stake`.

We call [`get_stct_proof`](https://github.com/dusk-network/wallet-core/blob/main/src/compat/stake.rs#L43) to get the proof needed to embed in the transaction:

```js
const getStctProofArgs = {
    "rng_seed": [...],
    "seed": [...],
    "refund": "..",
    "value": 400000000, // lets assume we are staking 4000 dusk
    "sender_index": 0,
    "gas_limit": ...,
    "gas_price": ...,
}

const { bytes, signature, crossover, blinder, fee } = call_get_stct_proof(wasm, getStctProofArgs);
```

Now we need to obtain the `stct` proof from the prover, to do that we just:

```js
const stctProofReq = await request(
    bytes,
    "prove_stct",
    false,
    "https://provers.dusk.network/",
    "rusk",
    "2"
);
```

Since this involves a different contract on the blockchain, we need to get the call data by calling  [`get_stake_call_data`](https://github.com/dusk-network/wallet-core/blob/main/src/compat/stake.rs#L153):

```js
const getStakeCallDataArgs = {
    "staker_index": 0,
    "seed": [...],
    "proof": stctProofReq,
    "value": 400000000,
    "counter": 0, // we get the actual counter from the stake-info from the node
}

const { contract, method, payload } = call_stake_call_data(wasm, getStakeCallDataArgs);
```

Now we just call execute like we did for transfer but with the following `callData`:

```js
const callData = {
    "contract": contract,
    "method": method,
    "payload": payload
};

const json = {
    "call": callData,
    ...
}

const { tx } =  call_execute(wasm, json);
```

## Proving

Then we convert the rkyv serialized unproven transaction to variable `bytes` using:

```js
const args = JSON.stringify({
   bytes: unprovenTx,
});

const txSerialized = jsonFromBytes(call(wasm, args, wasm.unproven_tx_to_bytes)).serialized;
```

Then, we can send it to the node for proof generation.

To obtain the proof, send the `prove_execute` request to the node:

```js
// send the prove execute
const proofReq = await request(
      varBytes,
      "prove_execute",
      false,
      "https://provers.dusk.network",
      "rusk",
      "2"
);
// get the response bytes 
const buffer = await proofReq.arrayBuffer();
const bytes = new Uint8Array(buffer);

// call the prove_tx function 
const args = JSON.stringify({
    unproven_tx: unprovenTx,
    proof: Array.from(proof),
});

const provedTx = jsonFromBytes(call(wasm, args, wasm.prove_tx));
```

Now you have to preverify the transaction before propagating it to the blockchain:

```js
// preverify the proved tx
const preVerifyReq = await request(
      provedTx,
      "preverify",
      false,
      undefined,
      "rusk",
      "2"
);

// log the status of the request (should be 200)
console.log("preverify request status code: " + preVerifyReq.status);

// propagate the proved tx
const propagateReq = await request(
      tx,
      "propagate_tx",
      false,
      undefined,
      "Chain",
      "2"
);

console.log("propagating chain request status: " + propagateReq.status);
```
You should receive a `200` status code for each request if successful.

The [rusk-wallet](/learn/rusk-wallet) library is an example of how to do these operations, and you can refer to it until more complete documentation is available.
