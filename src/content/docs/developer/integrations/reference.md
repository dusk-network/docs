---
title: Encoding & Hashing Reference
description: Address encoding and hashing algorithms used by the Dusk protocol.
---

This page collects small protocol references that are useful for integrators and indexers.

## Address format

Dusk wallet addresses are Base58-encoded bytes of compressed public keys.

| Address type | Underlying key(s) | Encoding |
| --- | --- | --- |
| **Moonlight** (public) | 1x `BLS12-381 G2` compressed (96 B) | `Base58` |
| **Phoenix** (shielded) | 2x `Jubjub` points (`A`, `B`) compressed (2 x 32 B) | `Base58` |

If you are building in Rust, the most reliable way to validate/parse addresses is to use `rusk_wallet::Address::from_str()` (it performs Base58 decoding, decompression, and structural checks).

## Hashing algorithms

High-level map of what hashes are used for what (internal details live in `rusk`):

- **SHA3-256**
  - Block hashes, Merkle roots, and various consensus-related IDs.
- **BLAKE3**
  - Contract bytecode hash and contract event bloom filters.
- **BLAKE2b**
  - Contract IDs.
  - Transaction IDs and `hash_to_scalar`-style hashing (hashing bytes, then mapping into a BLS scalar).
- **SHA2-256**
  - Integrity checks and some key-derivation primitives in the wallet stack.

:::tip[Tip]
If you can, prefer the official SDKs (for example w3sper) instead of re-implementing protocol hashing or encoding.
:::

