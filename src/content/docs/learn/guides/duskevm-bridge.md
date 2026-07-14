---
title: Bridge DUSK between Dusk L1 and DuskEVM Testnet
description: Move testnet DUSK between the Dusk L1 and DuskEVM through the Web Wallet.
---

The DuskEVM bridge keeps DUSK as the native asset on both sides. DUSK deposited into DuskEVM is available in the connected EVM account and pays DuskEVM gas.

The bridge interface labels the Dusk L1 side **DuskDS**. This guide uses **Dusk L1** for the network and **DuskDS** only for that on-screen label.

:::note
This guide uses testnet DUSK, which has no real-world value.
:::

## At a glance

| | |
|---|---|
| Network | DuskEVM Testnet; testnet DUSK only |
| Deposit actions | Submit on Dusk L1, then wait for the DuskEVM balance |
| Withdrawal actions | Initiate on DuskEVM, then prove and finalize on Dusk L1 |
| Readiness | Follow **Withdrawal status** in the Web Wallet |
| Fees | Source transaction fee, plus two Dusk L1 fees for withdrawal proof and finalization |

Withdrawal readiness depends on published network state, proof maturity, and dispute-game checks. The Web Wallet status is authoritative; do not calculate readiness from elapsed time alone.

## Before you start

You need:

- a Dusk account with enough unshielded testnet DUSK for the transfer and any Dusk L1 actions;
- an EVM wallet, such as MetaMask, that supports custom networks; and
- enough DUSK on the source side to cover the amount and transaction fee.

Request DUSK from the [testnet faucet](/operator/networks#how-to-get-testnet-tokens), then unshield the amount needed for Dusk L1 bridge actions.

The Web Wallet should add or select this network:

| Setting | Value |
|---|---|
| Network | DuskEVM Testnet |
| Chain ID | `745` |
| RPC | `https://rpc.testnet.evm.dusk.network` |
| Currency symbol | `DUSK` |

## Deposit into DuskEVM

1. Open the [testnet Web Wallet](https://apps.testnet.dusk.network/wallet/) and unlock your Dusk account.
2. Go to `Dashboard -> Bridge` and connect your EVM wallet.
3. Approve adding or switching to DuskEVM Testnet when your EVM wallet asks.
4. Set **From** to **DuskDS**, **To** to **DuskEVM**, and enter the amount.
5. Check the full destination address selected in your EVM wallet, then review and send the Dusk L1 transaction.

Keep the transaction hash until the deposit is visible on DuskEVM.

### Verify the deposit

Confirm the originating transaction in the [Dusk testnet explorer](https://apps.testnet.dusk.network/explorer/). Once the deposit is processed, check the connected account in your EVM wallet or the [DuskEVM testnet explorer](https://explorer.testnet.evm.dusk.network/).

The Dusk L1 transaction and DuskEVM credit occur on different layers and may not appear at the same time.

## Withdraw to Dusk L1

A withdrawal requires three on-chain actions: initiate it on DuskEVM, prove it on the Dusk L1, and finalize it on the Dusk L1.

### 1. Initiate the withdrawal

1. Open `Dashboard -> Bridge` in the testnet Web Wallet.
2. Connect the EVM wallet that holds the DUSK.
3. Set **From** to **DuskEVM** and **To** to **DuskDS**.
4. Enter the amount, check the destination Dusk account, and send.

Keep enough DUSK in the EVM account for gas and retain the DuskEVM transaction hash.

### 2. Check its status

Open **Withdrawal status**. The Web Wallet fills in the latest withdrawal from the current browser when available; otherwise, paste the DuskEVM transaction hash and select **Check status**.

The first status is normally **Waiting for output proposal**. No action is required until it changes to **Ready to prove**.

### 3. Prove on Dusk L1

When the status is **Ready to prove**, select **Prove withdrawal** and confirm the Dusk L1 transaction.

After the proof is submitted, the status moves through **Proof submitted** and **Waiting to finalize** while the required checks complete.

### 4. Finalize on Dusk L1

When the status is **Ready to finalize**, select **Finalize withdrawal** and confirm the Dusk L1 transaction that releases the DUSK.

Keep enough unshielded DUSK on the Dusk L1 to pay for both the proof and finalization transactions. The returned amount appears in the destination account after finalization confirms.

## Troubleshooting

**The EVM wallet shows the wrong network**

Switch to DuskEVM Testnet and confirm that the chain ID is `745`.

**A deposit succeeded on Dusk L1, but the DuskEVM balance has not changed**

Check the Dusk L1 transaction first, then search for the destination account in the DuskEVM explorer. The cross-layer credit may still be processing.

**A withdrawal is still pending**

Select **Check status**. Wait when the status is **Waiting for output proposal**, **Proof submitted**, or **Waiting to finalize**.

**The proof cannot be submitted**

Confirm that the status is **Ready to prove**, the intended Dusk account is unlocked, and it has enough unshielded DUSK for the transaction fee.

**Finalization cannot be submitted**

Confirm that the status is **Ready to finalize** and that the intended Dusk account has enough unshielded DUSK. If the Web Wallet returns to **Ready to prove**, submit the newer proof before trying to finalize again.

## Next steps

- [Understand DuskEVM](/learn/dusk-evm/)
- [Deploy a contract on DuskEVM](/developer/duskevm/quickstart/)
