---
title: Cryptography
description: An overview of the cryptographic primitives used in Dusk.
---

At the core of Dusk’s security model is a carefully curated suite of cryptographic primitives, many of which Dusk has helped pioneer. From the first Rust implementation of PLONK to research on PlonKup, FORT, and both the Reinforced Concrete hash and Poseidon Hash, Dusk has been pushing the state of the art to combine institutional-grade privacy with verifiable performance. Other building blocks such as BLS12-381, JubJub, Schnorr, sparse Merkle tree, and the PLONK proving system, form the low-level toolkit that powers Dusk.

## Dusk primitives

![Elliptic Curves image](../../../assets/elliptic_curves.png)

At the foundation of Dusk’s architecture are the cryptographic primitives - BLS12_381, JubJub, Schnorr and Poseidon. These cryptography tools provide the robust security and privacy features of the network. Besides these, we also make use of our own Merkle tree implementation called dusk-merkle, and our own PLONK proving system.

### BLS12_381

BLS12_381 is a pairing-friendly elliptic curve used within Dusk to enable aggregation of signatures, which significantly reduces the amount of data to be stored and transmitted over the network, improving overall efficiency of the blockchain. This curve is especially crucial in the context of zero-knowledge proofs, where it provides the backbone for secure and private transactions.

[Deep dive into BLS](/learn/deep-dive/cryptography/bls) 

### JubJub

JubJub is an elliptic curve specifically designed to enable fast, secure zero-knowledge proofs. This curve is utilized within Dusk for the construction of efficient zk-SNARKs, allowing transactions and contracts to maintain privacy and integrity without the need to reveal underlying data.

### Schnorr Signatures

Schnorr signatures are a type of digital signature scheme. They offer resistance against forgery. In Dusk, Schnorr signatures contribute significantly to securing user transactions and smart contract interactions. They ensure that only valid transactions are processed and added to the blockchain.

### Poseidon

Poseidon is a cryptographic hash function specifically designed for use in zero-knowledge circuits. It is optimized for performance, security and data integrity within Dusk. By producing a unique hash value for every distinct input, it forms the heart of Dusk’s data structures, making it virtually impossible to alter transaction data once it’s included in the blockchain.

[Deep dive into hashing](/learn/deep-dive/cryptography/hashing)

### Dusk-Merkle

Dusk also includes a custom, sparse Merkle tree implementation that is agnostic to the choice of hash function. Merkle trees are a fundamental part of many blockchains, enabling efficient and secure verification of large data structures. The Dusk Merkle tree is designed for flexibility and performance, given it’s used in multiple locations like the stake and transfer contract, and Citadel. 
 
### PLONK

PLONK is a versatile proof system developed to facilitate the implementation of zero-knowledge proofs. It forms the core of Dusk’s proof system, allowing efficient and private transactions on the network that are both small in proof size and fast to verify. 

With PLONK, developers can define custom and reusable circuits that can be integrated into Dusk based smart contracts. 

[Deep dive into PlonK](/learn/deep-dive/cryptography/plonk) 