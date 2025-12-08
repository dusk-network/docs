---
title: Wallet Terminology
description: Learn the differences between Dusk mnemonic, profile, accounts and addresses.
---

In Dusk, profiles and accounts are designed to provide enhanced flexibility, seamlessly integrating unique privacy and compliance features. At the core is the mnemonic, a human-readable sequence of words. This mnemonic serves as the foundation for wallet creation, generating a binary cryptographic seed that derives all keys and addresses within the wallet. Acting as a secure entry point, the wallet enables users to manage profiles, accounts, and addresses with ease.

![Wallet Hierarchy](../../../assets/wallet_hierarchy.png)


#### Mnemonic/Wallet:

The mnemonic is a human-readable sequence of words generated using <a href="https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki" target="_blank">BIP-39</a>, that serves as the foundation for wallet creation. 

The binary representation of the mnemonic is the cryptographic seed used to generate all keys and addresses in the wallet.
  
The wallet is the entry point for managing the accounts associated to the profile, and it serves as the secure container for digital assets.

### Profile and Accounts

A profile represents a pair of accounts, each designed for specific transaction types:

- **Shielded Account:** Designed for shielded (private) transactions, leveraging the [Phoenix transaction model](/learn/deep-dive/duskds-tx-models) to ensure both privacy and regulatory compliance.
- **Public Account:** Used for public (transparent) transactions, utilizing the [Moonlight transaction model](/learn/deep-dive/duskds-tx-models) to provide full transparency.

The profile enables seamless management of both privacy-preserving and transparent transactions.

### Addresses

An address is a unique identifier derived from an account’s public key, used for sending and receiving funds. Each account generates its own type of address:

- **Shielded Address**: Linked to the Phoenix Account, ensuring privacy.
- **Public Address**: Linked to the Moonlight Account, ensuring transparency.
