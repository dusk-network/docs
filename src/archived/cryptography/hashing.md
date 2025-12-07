---
title: Hashing
description: A breakdown of the hash functions utilized by Dusk.
---

Developers are not restricted to a specific set of cryptographic hash functions and can choose any hash function they prefer for their projects. The primary requirement is that the chosen hash function must be compatible with WASM.

## Blake2 optimizations

Although developers are free to use any hash algorithm, Dusk provides specific support for the Blake2 hash function. Blake2 is known for its speed and efficiency compared to other cryptographic hash functions like SHA-256. On Dusk, computing a Blake2 hash through a host function is computationally much cheaper than in-VM, as such it's much cheaper in terms of gas versus hash functions compiled into the contract. This feature can significantly reduce the operational costs of running smart contracts on Dusk, especially for applications that require frequently used or complex hashing operations.

The Blake2 hashing is integrated with operations involving `BlsScalar` types, which makes it work seamlessly with scalar values in cryptography. This is useful when performing operations such as digital signatures, zero-knowledge proofs (ZKPs), and other often used computationally expensive operations.

:::tip
The Blake2 hashing is integrated with operations involving `BlsScalar` types, which makes it work seamlessly with scalar values in cryptography.
:::

## Poseidon hash

Standard hash functions are usually not suited for ZKPs, as it's hard to combine them efficiently with the algebraic requirements of circuits. The necessity of framing operations as algebraic equations, introduces the need of using hash functions that are ZK "friendly".

Developers that want to leverage zk-proofs are recommended to use the <a href="https://github.com/dusk-network/Poseidon252" target="_blank">Poseidon hash</a>. 

:::tip
The Poseidon hash is designed specifically to be used in efficient ZKPs, particularly with SNARKs, as it incorporates components that are compatible with the arithmetic operations used in ZKP circuits.
:::
The following is an example of how a Poseidon hash can be computed:

```rust
let stct_message =
    stct_signature_message(&crossover, value, contract_id);
let stct_message = dusk_poseidon::sponge::hash(&stct_message);
```

### SAFE

Developers interested in cryptographic functions suitable for ZKPs can check out the <a href="https://github.com/dusk-network/safe/" target="_blank">SAFE</a> implementation. This is a minimal, `no_std`, pure Rust implementation designed to operate on any type that implements the `Default` and `Copy` traits.
