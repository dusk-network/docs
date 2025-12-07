---
title: Circuits
description: Learn how arithmetic circuits enabled advanced cryptographic functionalities within Dusk.
---

Arithmetic Circuits allow for zero-knowledge (ZK) operations, and are used e.g., by our genesis contracts for these specific use-cases:

- [Phoenix](/learn/deep-dive/duskds-tx-models): to spend notes and pay for gas.
- [Citadel](/developer/digital-identity/protocol): to use in the Self-Sovereign Identity implementation.

Developers can write their own ZK circuits as part of their smart contracts, allowing for the proving and verification of zero-knowledge proofs.

## Phoenix circuits

Circuits in Phoenix prove that the following conditions hold true:

1. **Membership**: Every note that is about to be spent is included in the Merkle tree of notes.
2. **Ownership**: The sender holds the note secret key for every note that is about to be spent.
3. **Nullification**: The nullifier is calculated correctly.
4. **Minting**: The value commitment for the newly minted notes are computed correctly.
5. **Balance integrity**: The sum of the values of all spent notes is equal to the sum of the values of all minted notes + the gas fee + a deposit, where a deposit refers to funds being transfered to a contract.

For additional information, you can have a look at the <a href="https://github.com/dusk-network/phoenix/tree/b3ee366887b131993f9e41a11286c39e10f2e816/circuits" target="_blank">circuits</a> and <a href="https://github.com/dusk-network/phoenix/blob/master/docs/v2/protocol.pdf" target="_blank">specifications</a>.

## Citadel circuits

Circuits in Citadel allow for the following actions:
Request Creation and Encryption:

1. **Stealth Address Generation:** A new stealth address is correctly generated using Diffie-Hellman.
2. **Data Encryption:** The license stealth address and an additional key are encrypted using the derived key.
3. **Session Initialization:** Public inputs are used to construct session data (e.g. session ID, session hash, commitments...).
4. **Verification**: Pedersen commitments and hash commitment are calculated and verified.
5. **Data Decryption:** Requested data is decrypted using the derived key.
6. **Signature Creation:** A signature for the license is generated using the license secret key and hash.
7. **License Data Encryption**: The signature and attribute data are encrypted with the public key of the license.
8. **Proof Generation**: A proof of membership in a Merkle tree is created.
9. **Proof Verification:**: Cryptographic commitments are computed and the signature of the session hash is verified.

For additional information, you can have a look at the <a href="https://github.com/dusk-network/citadel/blob/main/src/license.rs" target="_blank">circuits</a> and <a href="https://github.com/dusk-network/citadel/blob/main/docs/specs.pdf" target="_blank">specifications</a>.
