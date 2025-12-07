---
title: Multisig example
description: Use Dusk’s multisig to ensure your assets and operations remain secure.
---

## Multisigs on Moonlight

For developers looking to implement a multisig on Dusk, using the [Moonlight](/learn/deep-dive/duskds-tx-models) transaction model is a more viable solution. Unlike [Phoenix](/learn/deep-dive/duskds-tx-models), Moonlight does not obfuscate transactions, making multisig implementations straightforward and efficient.

In the Moonlight model, standard multisig techniques can be used. These involve multiple parties signing the same transaction with their private keys, which is then validated by the network.


The <a href="https://github.com/dusk-network/multisig-contract" target="_blank">Multisig repository</a> offers a robust multi-signature solution for Dusk transfers, designed to enable collaborative fund management with customizable approval thresholds.

The Multisig solution supports flexible, multi-signature transfers by requiring any *N* out of *M* designated keys for transaction approval. Using Dusk’s BLS multisig verification, users can create multisig accounts managed by multiple BLS keys, ensuring that a specified subset of account owners must authorize each critical transaction

Using the Multisig, users can:
- Create and manage multisig accounts.
- Deposit Dusk into a multisig account and transfer it out to Moonlight accounts.
- Update multisig accounts by modifying the set of signers or required signature thresholds.

## Multisig on Phoenix

When dealing with privacy-preserving transaction models like Phoenix, implementing multisig becomes significantly more complex due to the cryptographic requirements involved.

While a multisig requires multiple private keys signing a single transaction, Phoenix handles transactions by using obfuscated notes. This obfuscation ensures high levels of privacy but complicates the process of validating multisig transactions, where multiple parties need to collaborate without revealing their private keys or the transaction details.

Implementing multisig on obfuscated notes requires additional cryptographic techniques such as Multi-Party Computation (MPC). However, MPC is complex and computationally intensive, making it challenging to implement it efficiently. The overhead associated with MPC would make transactions slow and resource-intensive.