---
title: Migrate ERC20 or BEP20 DUSK to Dusk mainnet
description: Move DUSK from Ethereum or BSC to Dusk mainnet through the Web Wallet.
---

Use the Web Wallet migration flow to lock ERC20 DUSK on Ethereum or BEP20 DUSK on BNB Smart Chain (BSC) and receive the corresponding DUSK on Dusk mainnet.

## At a glance

| | |
|---|---|
| Direction | Ethereum or BSC to Dusk mainnet |
| Interface | [Mainnet Web Wallet](https://apps.dusk.network/wallet/) |
| Confirmations | Approve, if needed, then execute the migration |
| Typical time | Around one hour after the execution transaction confirms |
| Network fees | ETH on Ethereum or BNB on BSC for each submitted transaction |

:::caution
Approval does not migrate your DUSK. You must also select **Execute migration** and confirm that transaction.
:::

## Before you start

You need:

- a Dusk account in the Web Wallet to receive DUSK;
- a self-custodial EVM wallet that holds ERC20 or BEP20 DUSK and supports WalletConnect; and
- enough ETH or BNB to pay for up to two transactions on the source network.

An exchange account normally cannot connect through WalletConnect. Withdraw the tokens to a self-custodial wallet first.

## Migrate your DUSK

1. Open the [Web Wallet](https://apps.dusk.network/wallet/) and unlock or create the Dusk account that should receive the migrated DUSK.
2. Open **Migrate**, select **ERC-20** or **BEP-20**, and connect the EVM wallet that holds the tokens.
3. Enter the amount and select **Initialize migration**.
4. If prompted, select **Approve migration** and confirm the request in your EVM wallet. Wait for the Web Wallet to confirm the approval.
5. Select **Execute migration** and confirm the second request. This transaction locks the selected tokens and starts the migration.

The approval step is skipped when the migration contract already has sufficient allowance for the selected amount.

## Verify the migration

Track the **Execute migration** transaction through the link shown by the Web Wallet or through your EVM wallet. Once processing completes, the DUSK appears in the selected Dusk account. The EVM transaction hash is included in the memo of the corresponding Dusk transaction.

Processing normally takes around one hour after the execution transaction confirms. Network conditions can extend that time.

## Amount precision

DUSK uses 18 decimal places on Ethereum and BSC, but 9 decimal places on Dusk mainnet. The migration contract therefore rounds the requested amount down to the nearest `LUX`, the smallest Dusk mainnet unit.

- `1 DUSK = 1,000,000,000 LUX`
- The minimum migration amount is `1 LUX` (`0.000000001 DUSK`).
- Any fraction smaller than `1 LUX` is left in the source wallet rather than migrated.

## Troubleshooting

**Approval succeeded, but migration did not start**

Return to the Web Wallet and select **Execute migration**. Approval alone does not move any DUSK.

**A transaction is pending or failed**

Check the transaction in your EVM wallet and confirm that the account has enough ETH or BNB for gas. Retry only after the previous transaction has failed or been replaced.

**DUSK has not arrived after around one hour**

Confirm that the **Execute migration** transaction succeeded, not only the approval. Retain its transaction hash when seeking support.

**The received amount is slightly smaller**

The contract rounds down to a whole number of `LUX`. See [Amount precision](#amount-precision).
