---
title: Try Hedger on DuskEVM Testnet
description: Set up a Hedger private vault and test private DUSK transfers on DuskEVM Testnet.
---

[Hedger](https://hedger.dusk.network/) is an experimental privacy application on DuskEVM Testnet. It combines an ordinary EVM wallet with a separate private vault backed by encrypted notes and zero-knowledge proofs.

:::caution
Hedger is a testnet preview. Use only testnet DUSK, which has no real-world value. The interface, contracts, enrollment process, and stored test data can change or be reset.
:::

## What Hedger protects

Your EVM wallet remains the public account that signs transactions and pays gas. Hedger creates a separate private-vault key in your browser and uses it to encrypt values held inside the Hedger contract.

Hedger does not hide the entire EVM transaction. Wallet addresses, contract calls, deposits, withdrawals, and transaction timing remain visible on DuskEVM. Its current privacy boundary is the value represented by encrypted notes inside the vault. The recipient and Hedger's configured auditor can decrypt transferred values; the general public cannot.

The testnet preview currently requires both the sender and recipient to be enrolled. Enrollment associates an EVM account with its Hedger public key. This is part of the current contract design, not an EVM network allowlist.

## Before you start

You need:

- a supported EVM wallet;
- testnet DUSK in that wallet on DuskEVM Testnet;
- a safe place to store the 12-word Hedger recovery phrase; and
- enrollment for each account that will send or receive through Hedger.

The wallet should use:

| Setting | Value |
|---|---|
| Network | DuskEVM Testnet |
| Chain ID | `745` |
| RPC | `https://rpc.testnet.evm.dusk.network` |
| Currency symbol | `DUSK` |
| Explorer | `https://explorer.testnet.evm.dusk.network` |

If the EVM account does not have testnet DUSK yet, [bridge testnet DUSK from the Dusk L1](/learn/guides/duskevm-bridge/). Keep some DUSK outside Hedger to pay transaction fees.

## Set up the private vault

1. Open [hedger.dusk.network](https://hedger.dusk.network/).
2. Connect the EVM wallet you intend to keep using with this vault.
3. Select **Create new**.
4. Write down the 12-word recovery phrase in order and complete the backup check.
5. Create the local password used to unlock Hedger on this browser.

The password protects the encrypted key stored on the current device. It is not an on-chain password and Dusk cannot reset it. The recovery phrase is the backup for the private-vault key.

Never enter the recovery phrase into an enrollment form, support message, block explorer, or EVM wallet prompt.

## Complete testnet enrollment

Until public testnet registration replaces the current preview process, Hedger shows a **Complete your setup** panel when the connected account is not enrolled.

1. Copy the **Public Wallet Address** shown by Hedger.
2. Copy the **Private Vault Address** shown by Hedger.
3. Select the enrollment link in the application and submit those two public addresses.
4. Return with the same EVM account after enrollment is confirmed.

The private-vault address is a public key and can be shared for enrollment. The 12-word recovery phrase and the locally stored private key must remain secret.

## Test the DUSK flow

### Deposit into the private vault

1. Open **Wallet** in Hedger.
2. Select **Deposit**.
3. Enter an amount smaller than the public-wallet balance.
4. Confirm the EVM transaction and wait for Hedger to finish generating and submitting the proof.
5. Check that the public-wallet balance decreases and the private-vault balance increases.

Leave enough DUSK in the public wallet for later transactions.

### Send a private payment

The recipient must also be enrolled and must have completed Hedger setup.

1. Open **Pay** and select **Send**.
2. Enter the recipient's enrolled EVM address and the amount.
3. Review the destination carefully and confirm the transaction.
4. Wait for proof generation and transaction confirmation.

The EVM sender and recipient remain visible. Hedger's zero-knowledge proof validates the encrypted-note update without publishing the transferred value as an ordinary token transfer amount.

### Withdraw to the public wallet

1. Open **Wallet** and select **Withdraw**.
2. Enter an amount smaller than the private-vault balance.
3. Confirm the transaction and wait for the proof and receipt.
4. Check that the DUSK returns to the connected public EVM wallet.

This withdrawal is from Hedger to the EVM account. It is separate from withdrawing DUSK from DuskEVM back to the Dusk L1.

## Recovery and device changes

To restore the same vault on another browser or device, connect the original EVM account, choose **I have a recovery phrase**, enter the 12 words, and set a new local password.

The current preview does not yet provide a complete in-app forgotten-password reset. If the password is lost:

1. Confirm that the 12-word recovery phrase and the original EVM account are available.
2. Remove the site data for `hedger.dusk.network` through the browser settings.
3. Reopen Hedger, reconnect the original EVM account, and import the phrase.
4. Set a new local password.

Removing site data before confirming the recovery phrase can make the private balance inaccessible. Without the phrase, Dusk cannot recreate the user's private-vault key or authorize spending from that vault. The protocol's auditor visibility does not provide account recovery or spending authority.

## Troubleshooting

**The application says setup is incomplete**

Confirm that the connected EVM account and displayed private-vault address are the same pair submitted for enrollment. Enrollment is specific to that pair.

**The local key does not match the registered key**

The browser contains a different Hedger key from the one registered for the connected EVM account. Import the recovery phrase originally used with that account. Do not create another vault for the same account.

**A recipient cannot receive a payment**

Both parties must currently be enrolled. Confirm the recipient supplied the EVM address entered in the payment and completed private-vault setup.

**A balance or activity entry is missing on another device**

Connect the same EVM account and import the same Hedger recovery phrase. A different EVM account has a separate on-chain note history even when used in the same browser.

**A transaction fails because of insufficient funds**

The public EVM wallet must retain enough DUSK for gas, including when withdrawing or sending funds already held in the private vault.

## Developer status

The [Hedger contracts](https://github.com/dusk-network/hedger) and [web application](https://github.com/dusk-network/hedger-webapp) are available for review and testnet experimentation. The current deployment is verified in the [DuskEVM testnet explorer](https://explorer.testnet.evm.dusk.network/address/0x9c432f96eac8684F90161B7622f870568A7A6a19).

Hedger does not yet expose a stable production SDK or integration contract. Treat its ABI, proving artifacts, deployment addresses, enrollment model, and storage format as experimental. For general Solidity development, start with the [DuskEVM quickstart](/developer/duskevm/quickstart/).
