---
title: The Transfer Contract
description: Learn how transactions are processed using the Dusk transfer contract.
---

The <a href="https://github.com/dusk-network/rusk/tree/master/contracts/transfer" target="_blank">Transfer Contract</a> is the backbone of Dusk, enabling seamless transaction processing and gas fees payments. By supporting both shielded and public transactions, the Transfer Contract provides unmatched flexibility to balance privacy and compliance. This flexibility is achieved by specifying the transaction type upon submission, enabling precise routing of the payload.

As a result, Dusk accommodates a wide range of transaction needs and use cases, being able to provide both privacy and compliance.

The Transfer Contract provides support for:

- [Moonlight](/learn/deep-dive/transaction_models/moonlight): A transparent, account-based model.
- [Phoenix](/learn/deep-dive/transaction_models/phoenix): A privacy-preserving, UTXO-based model.

:::note[Note]
The Transfer Contract implements Dusk's Phoenix and Moonlight [transaction models](/learn/deep-dive/transaction_models/tx-models), allowing users to effortlessly switch between shielded and public transactions.
:::

These two models act as equivalent payment rails for Dusk:
- Moonlight resembles a wire transfer and provides transparency.
- Phoenix functions like cash, providing privacy.

Each model is designed for specific use cases, balancing unique trade-offs between privacy and practicality. Both models are fully compliant, much like how both cash and wire transfers are legitimate methods of transferring value. 

This dual-model approach provides the optimal flexibility for privacy and transparency.

# Paying for gas fees

[Gas fees](/learn/deep-dive/tx-fees) can be paid using Phoenix notes or Moonlight balances:
- When paying fees using Moonlight, fees are deducted directly from the sender's balance.
- When paying fees using Phoenix, fees are securely embedded in the zero-knowledge proof.

The Transfer Contract ensures the sender has sufficient funds to cover gas fees and manages these funds by paying them to Provisioners.

# Phoenix <> Moonlight

The Transfer Contract facilitates effortless transitions between transparency and privacy, allowing users to convert between Moonlight balances and Phoenix notes as needed. This gives users the flexibility to represent their funds in either form and switch seamlessly based on their preferences or requirements:

**Phoenix → Moonlight:**
- Spent Phoenix notes are processed and marked in the Merkle tree.
- The equivalent value is added to the user's Moonlight balance.

**Moonlight → Phoenix:**
- The user's Moonlight balance is reduced.
- A new Phoenix note is created and added to the Merkle tree.

:::note[Important]
Dusk makes use of a UTXO and account-based transaction model. The Transfer Contract allows users to securely convert between Phoenix notes and Moonlight balances.
:::

# Phoenix vs Moonlight

The Dusk Transfer Contract supports both Moonlight and Phoenix, offering flexibility for users to choose between:

| **Property**               | **Moonlight**                                    | **Phoenix**                                      |
|----------------------------|--------------------------------------------------|-------------------------------------------------|
| **Model**                  | Transparent, Account-Based                       | Privacy-Preserving, UTXO-Based                  |
| **Privacy**                | None: transaction details are public            | Shielded – details are hidden via zk-proofs, while still allowing the receiver to prove the source of funds for compliance purposes |
| **Balance Verification**   | Publicly checked via account balances            | Privately verified via zk-proofs                |
| **Double-Spending** | Prevented by visible account states            | Prevented by nullifiers                           |
| **Ideal Use Case**          | Transparency (e.g. wire transfer)    | Confidentiality (e.g. cash)  |


# Quick Links
- Learn more about [Moonlight](/learn/deep-dive/transaction_models/moonlight).
- Learn more about [Phoenix](/learn/deep-dive/transaction_models/phoenix).
- Read the [Whitepaper](https://dusk-cms.ams3.digitaloceanspaces.com/Dusk_Whitepaper_2024_4db72f92a1.pdf).
