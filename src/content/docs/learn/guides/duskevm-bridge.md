---
title: Bridge DUSK from DuskDS to DuskEVM Testnet
description: How to use the Dusk Web Wallet to move DUSK from the DuskDS testnet to the DuskEVM testnet and interact with the EVM network.
---

This guide explains how to bridge your DUSK on DuskDS to DuskEVM on the public testnet using the official Dusk Web Wallet.

Once bridged, your DUSK becomes the native gas token on DuskEVM, so you can deploy and interact with smart contracts using standard EVM tooling.

## 1) Prerequisites

Before you start, make sure you have:

- A Dusk Web Wallet account and some testnet DUSK. For more details on getting testnet DUSK see the [Nocturne Faucet Guide](/operator/networks#how-to-get-testnet-tokens).
- Make sure to have the amount of DUSK unshielded you want to bridge.
- A Web3 wallet (e.g. MetaMask) installed in your browser.
- Optional, for developers: familiarity with the [DuskEVM deep dive](/learn/deep-dive/dusk-evm/) and [Deploy on DuskEVM](/developer/smart-contracts-dusk-evm/deploy-on-evm/).

## 2) Open the Web Wallet on DuskDS testnet

1. Visit the [Dusk Web Wallet](https://apps.testnet.dusk.network/wallet/)
2. Unlock your wallet (or restore it with your 12‑word recovery phrase if needed).
3. Confirm you have enough unshielded DUSK. You need enough for the amount you want to bridge and a small bridge fee.

If needed, convert shielded funds to public (unshield) first, using the standard Web Wallet flow.

## 3) Connect a Web3 wallet to DuskEVM Testnet

1. In the Web Wallet sidebar, go to Dashboard -> Bridge.
2. If no Web3 wallet is connected yet, you’ll see a button:
   > **CONNECT WEB3 WALLET**
3. Click the button. A connect modal opens (via Reown) with wallet options such as MetaMask or WalletConnect.
4. Select your preferred Web3 wallet and approve the connection.
5. When prompted by your Web3 wallet:
   - Approve adding DuskEVM as a network (if it’s not already added).
   - Approve switching the active network to DuskEVM.
6. After successful connection the Bridge UI becomes active. The bridge now knows:
    - Your DuskDS unshielded address (from the web wallet).
    - Your EVM address (from the connected Web3 wallet).

## 4) Configure the bridge (DuskDS -> DuskEVM)

On the Bridge page you’ll see a three‑step wizard.

### 4.1 Choose origin and destination networks

In Step 1 of the wizard ("Bridge" screen):
- Under **From**, select **DuskDS**.
- Under **To**, select **DuskEVM**.

The UI enforces that **From** and **To** can’t be the same, so as soon as you choose `DuskDS` as the origin, `DuskEVM` will be the only valid destination (and vice‑versa).

### 4.2 Enter the amount

1. In the **Amount** field, enter how much DUSK you want to bridge.
2. The wallet will:
   - Show your **DuskDS unshielded balance**.
   - Prevent you from spending more than your available balance minus fees.

### 4.3 (Advanced) Adjust gas settings

Because this is a deposit from DuskDS to DuskEVM, you’ll see a Gas Settings panel:

- Gas limit and gas price are pre‑filled with sensible defaults.
- The estimated Gas fee is shown and will be deducted from your unshielded DUSK balance.
- Advanced users can tweak these values, but for most testnet use‑cases the defaults are recommended.

If the gas settings are invalid, the Next button will be disabled until you correct them.

## 5) Review and send the bridge transaction

Click Next to move to Step 2 of the wizard (review screen).

Here you’ll see:

- **Amount** – the DUSK amount that will be bridged.
- **From** – your DuskDS unshielded address.
- **To** – your EVM address on DuskEVM (from your connected Web3 wallet).
- **Gas fee** – shown via the gas fee component.
- **Fee Details** – clarifying that fees are taken from your unshielded balance.

Carefully verify:

- The **direction** is **From: DuskDS** -> **To: DuskEVM**.
- The **destination address** matches the EVM address you expect.
- The **amount** is correct.

If everything looks good:

1. Click SEND.
2. The wizard moves to Step 3 (status screen).
   You’ll see status messages such as "Processing transaction" and "Transaction pending", and a "VIEW ON BLOCK EXPLORER" button for the originating transaction.

Under the hood, the wallet creates and broadcasts a DuskDS transaction that calls the bridge contract’s `deposit` function with your amount. This locks DUSK on DuskDS and schedules minting on DuskEVM for your EVM address.

## 6) Track the bridge & check explorers

### 6.1 On DuskDS

When the DuskDS transaction is created the status screen in the bridge wizard shows your transaction as **pending**. The "VIEW ON BLOCK EXPLORER" button opens the Dusk block explorer, where you can inspect the transaction status, fees and gas used.

You can also manually go to the [DuskDS Testnet Explorer](https://apps.testnet.dusk.network/explorer/) and search by your DuskDS address or the transaction hash.

### 6.2 On DuskEVM Testnet

Once the deposit has been processed by DuskEVM, which can take a couple of minutes, your EVM wallet’s DUSK balance on DuskEVM Testnet will increase. You can review this in the transaction history on your Web3 wallet.

To inspect this on the explorer:

1. Open the [DuskEVM testnet explorer](https://explorer.testnet.evm.dusk.network/).
2. Search by your EVM address.
3. You’ll see standard EVM‑style transaction details: Block number, gas used, logs, etc.

Because DuskEVM is an EVM‑equivalent environment, the explorer behaves much like other EVM explorers.

## 7) Interacting with DuskEVM after bridging

Once you have DUSK on DuskEVM Testnet, you can use it just like gas on any EVM chain:

### 7.1 Use your Web3 wallet normally

- Keep your Web3 wallet network set to DuskEVM.
- Your bridged DUSK appears as the native gas token.
- You can send DUSK to other EVM addresses on DuskEVM, and approve and interact with DeFi or other dApps that support DuskEVM.

### 7.2 Deploy and test smart contracts

For developers:

1. Configure your tooling (Hardhat, Foundry, etc.) to talk to the DuskEVM testnet RPC endpoint and chain ID. These details are available on the [Deploy on DuskEVM](/developer/smart-contracts-dusk-evm/deploy-on-evm/) guide.
2. Use the same EVM address you funded via the bridge as the deployer:
   - Hardhat: set the private key of that account in your network config.
   - Foundry: use the same account for `forge create` / `cast` commands.
3. Gas costs and transaction semantics follow the EVM‑equivalent rules described in the [DuskEVM overview](/learn/deep-dive/dusk-evm/).

Because DuskEVM is EVM‑equivalent and built on the OP Stack, most Ethereum tooling works out of the box — you only need to point it to the correct RPC and chain ID.

### 7.3 Use dApps on DuskEVM

If a dApp supports DuskEVM:

1. Open the dApp in your browser.
2. Ensure your Web3 wallet is connected to **DuskEVM**.
3. Connect the wallet inside the dApp as you would on any other EVM chain.
4. Use your bridged DUSK to: Provide liquidity, trade, interact with protocols.

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
- On the DuskDS side, the withdrawal becomes finalizable after a certain number of blocks (the finalization period).
- The Web Wallet’s Bridge -> Transactions view shows your pending withdrawals:
  - Once a withdrawal is ready, a "Finalize now" button appears.
  - Clicking it sends a DuskDS transaction to finalize the withdrawal and release your DUSK back to your DuskDS account, this can take up to 15 minutes.
