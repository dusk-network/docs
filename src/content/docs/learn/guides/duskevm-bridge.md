---
title: Bridge DUSK between DuskDS and DuskEVM Testnet
description: Use the Dusk Web Wallet to move testnet DUSK between DuskDS and DuskEVM.
---

The Dusk bridge moves DUSK between DuskDS and DuskEVM while keeping one native asset across both environments. On DuskEVM, the bridged DUSK is available in your EVM account and is used to pay gas.

This guide uses testnet DUSK, which has no real-world value, and the testnet Web Wallet.

## Before you start

You need:

- a Dusk Web Wallet account with unshielded testnet DUSK for deposits and withdrawal actions on DuskDS;
- an EVM wallet, such as MetaMask, that supports adding a custom network; and
- enough DUSK in the source account to cover the bridge amount and its transaction fee.

Request DUSK from the [testnet faucet](/operator/networks#how-to-get-testnet-tokens), then unshield the amount you want to bridge.

## Deposit into DuskEVM

### 1. Open the bridge

1. Open the [testnet Web Wallet](https://apps.testnet.dusk.network/wallet/) and unlock your account.
2. Go to `Dashboard -> Bridge`.
3. Connect your EVM wallet.
4. Approve adding or switching to DuskEVM Testnet when your EVM wallet asks.

Your wallet should be connected to:

| Setting | Value |
|---|---|
| Network | DuskEVM Testnet |
| Chain ID | `745` |
| RPC | `https://rpc.testnet.evm.dusk.network` |
| Currency symbol | `DUSK` |

### 2. Configure the transfer

Set:

- **From:** DuskDS
- **To:** DuskEVM
- **Amount:** the amount of testnet DUSK to deposit

The destination is the address currently selected in your connected EVM wallet. Check the full address before continuing; an EVM transaction cannot correct a deposit sent to the wrong account.

### 3. Review and send

On the review screen, confirm:

- the direction is DuskDS to DuskEVM;
- the DuskDS source account and EVM destination are correct;
- the amount and fee are acceptable.

Send the transaction and keep the status screen open until the wallet has recorded it. The originating transaction can also be inspected in the [DuskDS testnet explorer](https://apps.testnet.dusk.network/explorer/).

### 4. Confirm the deposit

After the deposit is processed, the balance of the connected EVM account increases on DuskEVM Testnet. Check it in your EVM wallet or search for the address in the [DuskEVM testnet explorer](https://explorer.testnet.evm.dusk.network/).

The DuskDS transaction and the resulting DuskEVM credit happen on different layers, so they do not necessarily appear at the same moment.

## Withdraw to DuskDS

A withdrawal returns DUSK from your EVM account to DuskDS. Unlike a deposit, it requires three on-chain actions: initiate the withdrawal on DuskEVM, prove it on DuskDS, and finalize it on DuskDS.

### 1. Submit the withdrawal

1. Open `Dashboard -> Bridge` in the testnet Web Wallet.
2. Connect the EVM wallet that holds the DUSK.
3. Set **From** to DuskEVM and **To** to DuskDS.
4. Enter the amount, review the destination DuskDS account, and send.

The first transaction is submitted on DuskEVM. Keep enough DUSK in the EVM account to pay its gas fee, and retain the withdrawal transaction hash.

### 2. Check the withdrawal status

Open **Withdrawal status** from the bridge. The latest withdrawal made in the current browser is filled in automatically. Otherwise, paste the DuskEVM withdrawal transaction hash and select **Check status**.

The first status is normally **Waiting for output proposal**. No action is required until the network has published an output that covers the withdrawal.

### 3. Prove on DuskDS

When the status changes to **Ready to prove**, select **Prove withdrawal** and confirm the DuskDS transaction in the Web Wallet.

After the proof is submitted, the status changes to **Waiting to finalize** while the proof maturity delay and dispute-game checks complete.

:::note
Proof and finalization readiness are determined by network state, not by a timer alone. Use **Check status** rather than calculating readiness from elapsed time.
:::

### 4. Finalize on DuskDS

When the status changes to **Ready to finalize**, select **Finalize withdrawal** and confirm the DuskDS transaction that releases the DUSK to your DuskDS account.

Proving and finalizing are separate DuskDS transactions. Keep enough unshielded DUSK on DuskDS to pay both fees. After finalization is confirmed, the returned amount appears in the destination account.

## Troubleshooting

**The EVM wallet shows the wrong network**

Switch to DuskEVM Testnet and confirm that the chain ID is `745` before retrying.

**The DuskDS deposit succeeded but the EVM balance has not changed**

The deposit may still be processing between layers. Check the originating DuskDS transaction first, then the destination address in the DuskEVM explorer.

**A withdrawal is still pending**

Pending does not mean failed. Open **Withdrawal status** and select **Check status**. Wait if the status reports **Waiting for output proposal**, **Proof submitted**, or **Waiting to finalize**.

**The proof cannot be submitted**

Confirm that the status is **Ready to prove**, the correct DuskDS account is unlocked, and the account has enough unshielded DUSK for the proof transaction fee.

**Finalization cannot be submitted**

Confirm that the status is **Ready to finalize**, the correct DuskDS account is unlocked, and the account has enough unshielded DUSK for the finalization transaction fee. If the Web Wallet offers **Prove withdrawal** again, submit the newer proof before trying to finalize.

## Next steps

- [Understand how DuskEVM works](/learn/dusk-evm/)
- [Deploy a contract on DuskEVM](/developer/duskevm/quickstart/)
