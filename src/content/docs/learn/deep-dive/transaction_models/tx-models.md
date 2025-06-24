---
title: Transaction Models
description: Dive into the different transaction models available on Dusk and their unique features.
---

A transaction model defines how transactions are structured, verified, and recorded. Consequently, a transaction model specifies the rules that allow assets to be transferred between participants on a network.

The structure of a transaction typically includes inputs and outputs. Each transaction must be cryptographically signed by the sender to verify authenticity and prevent tampering.

Transactions must comply with network rules (e.g. no double-spending), and nodes validate transactions before they are added to the blockchain.

## Types of Transaction Models

Usually, transaction models are based on UTXOs or accounts.

### UTXOs

In an unspent transaction output (UTXO) model, each transaction creates new outputs that can be used as inputs in future transactions. The sum of inputs must equal or exceed the sum of outputs. If there are outputs that have not been used as inputs in other transactions, it means that they have not been "spent". This implies that the "unspent" outputs are actually available funds, as they can be spent by using them as inputs in another transaction. This model is useful to preserve privacy, as users are handling notes (inputs/outputs) rather than a balance associated to an account.

### Account model

In the account model instead, each account has a balance that increases or decreases with each transaction. Transactions modify the account's balance directly, and the funds can be spent if the balance allows for it.

Dusk introduced innovative transaction models to protect user's privacy and enable flexibility when complying with regulations.

## Transaction Models on Dusk

Dusk makes use of a dual transaction model, one for private transactions and another for public transactions.

### Phoenix

Phoenix is a primitive of Dusk, and it's used in the transfer of native DUSK. With Phoenix, there are no balances connected to users' addresses. Instead, users can spend "notes" in a completely private manner by leveraging Zero Knowledge Proofs.

Moreover, phoenix is the custom-built zero-knowledge proof-powered Dusk UTXO transaction model enabling privacy-preserving transactions. Phoenix, encapsulated in the Transfer contract, is an integral part of Dusk’s privacy-preserving smart contract capabilities, enforcing the anonymity of contract callers and guaranteeing a level of privacy unavailable on other networks.

Phoenix uses ZKPs to prevent double-spending attacks and prove the ownership of unspent outputs. An owner of a note can share their View Key, allowing third parties to detect the outputs belonging to the owner, and in case of obfuscated notes, the value encrypted within. A note can only be spent via a Secret Key, known exclusively to the owner of the note.


[Deep dive into Phoenix](/learn/deep-dive/transaction_models/phoenix)

### Moonlight

Moonlight is an account-based transaction model, which keeps track of balances for accounts and contracts. Moonlight is fully transparent, making it easy to interact with external protocols that do not preserve privacy.
Users can convert funds between Moonlight and Phoenix (and vice-versa), making Moonlight a completely integrated transparent account model on Dusk.

[Deep dive into Moonlight](/learn/deep-dive/transaction_models/moonlight)


### Phoenix vs Moonlight

The first main difference between Phoenix and Moonlight is that transactions on Phoenix use ZKPs and are therefore completely private and anonymous. On the other hand, transactions on Moonlight are fully transparent and do not require expensive Zero Knowledge Proofs. This results in lower gas costs (cheaper transactions) for Moonlight transactions. The second is that UTXO and account-based transaction models are fundamentally different, which has some implications for applications that want to use one or the other. The good thing is that you are free to choose.