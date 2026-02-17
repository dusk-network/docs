---
title: Cryptography
description: The main cryptographic building blocks behind Dusk’s privacy and verification.
---

Dusk uses zero-knowledge proofs and elliptic curve cryptography to enable confidential transactions and selective disclosure.
This page is a high-level map of the primitives you’ll see referenced across the docs.

For protocol-level details and formal security arguments, refer to the [Dusk whitepaper](https://dusk-cms.ams3.digitaloceanspaces.com/Dusk_Whitepaper_2024_4db72f92a1.pdf) and the papers listed in [Additional Resources](/learn/deep-dive/additional-resources).

## Primitives used in Dusk

![Elliptic Curves image](../../../assets/elliptic_curves.png)

At the foundation of Dusk’s architecture are primitives like **BLS12-381**, **JubJub**, **Schnorr**, and **Poseidon**. Dusk also uses Merkle tree constructions and a PLONK-based proving stack.

### BLS12-381

BLS12-381 is a pairing-friendly elliptic curve used in many modern proof systems. In Dusk it appears as part of the zero-knowledge and signature stack.

### JubJub

JubJub is an elliptic curve that’s efficient in SNARK-friendly settings and is commonly used in privacy-preserving designs.

### Schnorr Signatures

Schnorr signatures are a signature scheme used for authentication and integrity. In Dusk they are part of the foundation for signing and verifying protocol actions.

### Poseidon

Poseidon is a hash function designed to be efficient inside zero-knowledge circuits. It is commonly used for commitments and Merkle tree hashing in ZK applications.

### dusk-merkle

Dusk includes a sparse Merkle tree implementation (`dusk-merkle`). Merkle trees enable efficient membership proofs over large datasets and show up throughout blockchain systems.

### PLONK

PLONK is a proving system used to build zero-knowledge proofs. In Dusk it underpins privacy-preserving transactions and protocols that require succinct, verifiable computation.

With PLONK, developers can define reusable circuits and generate proofs that can be verified on-chain.
