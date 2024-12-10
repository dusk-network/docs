---
title: The transfer contract
description: Learn how transactions are processed using the Dusk transfer contract.
---

The <a href="https://github.com/dusk-network/rusk/tree/master/contracts/transfer" target="_blank">Transfer Contract</a> is a vital component of the Dusk network, responsible for verifying transactions and managing gas payments.

## Phoenix in the transfer contract

The Transfer Contract maintains a Merkle tree structure to store obfuscated notes, representing unspent transaction outputs (UTXOs).
To spend a note, users must provide a zero-knowledge proof, enabling them to spend valid notes without revealing any details.
To preserve privacy and prevent double-spending, the Transfer Contract uses nullifiers; once a note is spent, the nullifier ensures it cannot be reused.

Upon verifying the zk-proof, the contract updates the Merkle tree to reflect the spent note and records the corresponding nullifier.

Each transaction generates two new notes: one for the recipient and another as change for the sender. While the Transfer Contract can accept up to four notes as inputs, it consistently provides two notes as outputs.

The Transfer Contract ensures the sender has sufficient funds to cover gas fees and manages these funds by paying them to Provisioners.

The Transfer Contract is essential in Dusk, handling various types of transactions, such as Phoenix and Moonlight. The transaction type is specified when sent to the Transfer Contract, allowing it to direct the payload accordingly.

## Phoenix transfer contract flow

The Transfer Contract operates through the following steps:

1) A user initiates a transaction by sending it to the transfer contract. This transaction includes the necessary zk-proof to demonstrate ownership of the note to be spent.

2) The contract calculates the gas required for the transaction and ensures the sender has enough funds to cover these fees. This ensures that the transaction can be processed without any issues.

3) The Transfer contract verifies the zk-proof to ensure it is valid. This verification process confirms that the user possesses a legitimate note without revealing any specific information about the note itself.

4) Depending on the transaction type specified, the transfer contract directs the payload to the appropriate contract or logic for further processing.

5) Once the proof is verified, the transfer contract updates the Merkle tree to mark the note as spent and records the nullifier. It then generates two new notes—one for the recipient and another as change for the sender.