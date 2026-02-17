---
title: Bridge DUSK from DuskDS to DuskEVM Testnet
description: How to use the Dusk Web Wallet to move DUSK from the DuskDS testnet to the DuskEVM testnet and interact with the EVM network.
---

Bridge testnet DUSK (nDUSK) from DuskDS to DuskEVM using the official Dusk Web Wallet. Once bridged, DUSK is the native gas token on DuskEVM Testnet.

## Fast path

1. Get testnet DUSK (nDUSK) in the Web Wallet and **unshield** the amount you want to bridge. See: [How to get testnet tokens](/operator/networks#how-to-get-testnet-tokens).
2. Open the Web Wallet (testnet): [apps.testnet.dusk.network/wallet](https://apps.testnet.dusk.network/wallet/)
3. Go to `Dashboard -> Bridge` and connect your Web3 wallet (approve adding/switching to DuskEVM when prompted).
4. Set **From: DuskDS** and **To: DuskEVM**, enter an amount, and send.
5. Track status:
   - DuskDS explorer: [apps.testnet.dusk.network/explorer](https://apps.testnet.dusk.network/explorer/)
   - DuskEVM explorer: [explorer.testnet.evm.dusk.network](https://explorer.testnet.evm.dusk.network/)

## 1) Prerequisites

- A Dusk Web Wallet account with some **testnet DUSK (nDUSK)** (and the amount you want to bridge **unshielded**). See: [How to get testnet tokens](/operator/networks#how-to-get-testnet-tokens).
- A Web3 wallet (e.g. MetaMask) installed in your browser.
- Optional: [DuskEVM deep dive](/learn/deep-dive/dusk-evm/) and [Deploy on DuskEVM](/developer/smart-contracts-dusk-evm/deploy-on-evm/).

## 2) Open the Web Wallet on DuskDS testnet

1. Visit the [Dusk Web Wallet](https://apps.testnet.dusk.network/wallet/).
2. Unlock your wallet.
3. Confirm you have enough **unshielded** DUSK for the bridge amount and fees.

## 3) Connect a Web3 wallet to DuskEVM Testnet

1. In the Web Wallet sidebar, go to `Dashboard -> Bridge`.
2. Click **CONNECT WEB3 WALLET** and connect your wallet (MetaMask / WalletConnect, etc.).
3. When prompted by your wallet, approve:
   - Adding DuskEVM as a network (if needed).
   - Switching to the DuskEVM network.

## 4) Configure the bridge (DuskDS -> DuskEVM)

On the Bridge page you’ll see a short wizard.

### 4.1 Choose origin and destination networks

- Under **From**, select **DuskDS**.
- Under **To**, select **DuskEVM**.

### 4.2 Enter the amount

In the **Amount** field, enter how much DUSK you want to bridge. The wallet will prevent you from spending more than your available balance minus fees.

### 4.3 (Advanced) Adjust gas settings

If you see a Gas Settings panel, the defaults are usually fine for testnet.

## 5) Review and send the bridge transaction

Click Next to move to Step 2 of the wizard (review screen).

Here you’ll see:

- **Amount** – the DUSK amount that will be bridged.
- **From** – your DuskDS unshielded address.
- **To** – your EVM address on DuskEVM (from your connected Web3 wallet).
- **Gas fee** – shown via the gas fee component.

Carefully verify:

- The **direction** is **From: DuskDS** -> **To: DuskEVM**.
- The **destination address** matches the EVM address you expect.
- The **amount** is correct.

If everything looks good:

1. Click SEND.
2. The wizard moves to Step 3 (status screen).
   You’ll see status messages such as "Processing transaction" and "Transaction pending", and a "VIEW ON BLOCK EXPLORER" button for the originating transaction.

:::note
Under the hood, this is a DuskDS transaction that triggers a deposit into the bridge, which results in funds being credited to your EVM address on DuskEVM.
:::

## 6) Track the bridge & check explorers

### 6.1 On DuskDS

Use the "VIEW ON BLOCK EXPLORER" button, or open the [DuskDS Testnet Explorer](https://apps.testnet.dusk.network/explorer/) and search by address/transaction hash.

### 6.2 On DuskEVM Testnet

Once processed (often a couple of minutes), your EVM wallet’s DUSK balance on DuskEVM Testnet will increase. You can inspect this on the [DuskEVM testnet explorer](https://explorer.testnet.evm.dusk.network/) by searching for your EVM address.

## 7) Interacting with DuskEVM after bridging

After bridging, you can use DUSK as gas and interact with EVM contracts as usual.

For developers, next steps:

- [Deploy on DuskEVM](/developer/smart-contracts-dusk-evm/deploy-on-evm/)
- [DuskEVM deep dive](/learn/deep-dive/dusk-evm/)

## 8) (Optional) Withdrawing from DuskEVM back to DuskDS

The same Web Wallet bridge UI also supports DuskEVM -> DuskDS withdrawals:

1. Go to Dashboard -> Bridge in the Web Wallet.
2. Make sure your Web3 wallet is connected to DuskEVM.
3. In the Bridge wizard:
   - Set **From** to **DuskEVM**.
   - Set **To** to **DuskDS**.
4. Enter the amount and follow the same review/send flow.

After you submit a withdrawal:

- A transaction is sent on DuskEVM calling the standard bridge contract.
- On the DuskDS side, the withdrawal becomes finalizable after the configured finalization period.
- The Web Wallet’s Bridge -> Transactions view shows your pending withdrawals:
  - Once a withdrawal is ready, a "Finalize now" button appears.
  - Clicking it sends a DuskDS transaction to finalize the withdrawal and release your DUSK back to your DuskDS account.
