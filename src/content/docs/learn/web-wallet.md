---
title: Web Wallet
description: Use the Dusk Web Wallet to manage DUSK in your browser.
---

The Dusk Web Wallet is the simplest way to manage DUSK and interact with the network.
It runs in your browser and supports both **public** (Moonlight) and **shielded** (Phoenix) transfers.

## What you can do with it

- Create or restore a Dusk wallet from a mnemonic.
- Send and receive DUSK using public or shielded transfers.
- Migrate ERC20/BEP20 DUSK to native DUSK: [ERC20/BEP20 Migration](/learn/guides/mainnet-migration).
- Bridge native DUSK to BSC: [Native DUSK to BEP20 Bridge](/learn/guides/bep20-bridge).
- Bridge DuskDS testnet to DuskEVM testnet: [DuskDS to DuskEVM bridge](/learn/guides/duskevm-bridge).

For node/operator staking workflows, use the CLI wallet and operator guides instead:
[Staking on Dusk](/learn/guides/staking-basics), [Rusk Wallet](/learn/rusk-wallet), and [Run a provisioner node](/operator/provisioner).

## How to use the Web Wallet

### 1) Open the Web Wallet

Visit the official Web Wallet at <a href="https://apps.dusk.network/wallet/" target="_blank" rel="noreferrer">apps.dusk.network/wallet</a>.

:::note[Important]
Always verify the URL before entering your recovery phrase. Never share your mnemonic or private keys.
:::

### 2) Create or restore a wallet

You can either create a new wallet or restore an existing one using your recovery phrase.

#### Option A) Create a new wallet

1. Click **Create New Wallet**.
2. Write down and securely store your **12-word recovery phrase**.
3. Set a **strong password** to encrypt your wallet.

#### Option B) Restore an existing wallet

1. Click **Restore Wallet**.
2. Enter your **12-word recovery phrase** and follow the prompts.

### 3) Receive or send DUSK

- **Receive**: open the **Receive** tab and copy your address.
- **Send**: open the **Send** tab, enter the recipient and amount, then choose **public** or **shielded**.

:::tip
Public transfers use Moonlight. Shielded transfers use Phoenix. Learn more about both models in [Transaction Models on Dusk](/learn/deep-dive/duskds-tx-models).
:::
