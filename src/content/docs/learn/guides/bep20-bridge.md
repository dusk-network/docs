---
title: Native DUSK to BEP20 Bridge
description: How to bridge your native DUSK tokens to BEP20 DUSK on Binance Smart Chain.
---

This guide explains how to bridge **native DUSK** (Dusk mainnet) to **BEP20 DUSK** on Binance Smart Chain (BSC) using the [Web Wallet](https://apps.dusk.network/wallet/).

When bridging, your native DUSK tokens are locked on the Dusk network. Once locked, a mint operation is initiated on Binance Smart Chain, issuing an equivalent amount of BEP20 DUSK to your specified address. The full bridging process typically completes within 15 minutes.

:::note
Want to **bridge from BEP20 DUSK to native DUSK** instead? Check our [Migration Guide](/learn/guides/mainnet-migration/) for the complete walkthrough.
:::

## Who this is for

- You have **native DUSK** on Dusk mainnet.
- You want **BEP20 DUSK** in an EVM wallet on BSC.

## What you need

- Access to the [Web Wallet](https://apps.dusk.network/wallet/).
- Enough native DUSK to cover the amount you want to bridge **plus** the bridge fee.
- A **BSC EVM address** (starts with `0x...`) where you want to receive BEP20 DUSK.

:::caution
The BSC address is provided in the **memo** field. If you omit the memo or provide an invalid address, the bridge will not know where to mint, and funds can be lost.
:::

## Expected time and fees

- **Time**: typically ~15 minutes.
- **Fees**: the bridge charges a flat **1 DUSK** fee per transaction (your minted amount is `sent - 1 DUSK`).

## Steps

1. Open the [Web Wallet](https://apps.dusk.network/wallet/).
2. Open or import your native Dusk wallet.
3. Navigate to the **Send** tab.
4. Enter the official **Bridge Address** as the recipient:
```
24jFms4JqYdWb19jFn3CUjNUQz1AeRozYnwsHuUkLbXAj2gRBq598aLAJmqmsaPcsCNJTgTaJTaUZCXpT3s9UeWBsHTmd5hQx95JymZSUsmtwoibiB8AMp4bZjAiLMjmAH3x
```
5. In the **Memo** field, enter your **BEP20 compatible address** (your BSC wallet address).
6. Specify the amount of native DUSK to bridge. The minimum is 1.000000001 DUSK (just over 1 DUSK).
7. Review and confirm the transaction.

Your DUSK will be locked on the Dusk network, and an equivalent amount will be minted on BSC shortly after.

## FAQ

**How long does the bridge process take?**  
Typically within 15 minutes. Network congestion or confirmations may slightly affect the timing.

**Where do the BEP20 tokens go?**  
They are sent to the EVM address specified in the memo field.

**What happens if I omit the memo or use an invalid address?**  
The bridge will ignore your transaction, and funds will not be bridged. This means your funds would be lost. Always double-check the memo field before confirming.

**Can I use this bridge for ERC20 DUSK?**  
No. This bridge only supports native DUSK to **BEP20 DUSK** on Binance Smart Chain.

**Is there a fee?**  
Yes, the bridge charges a flat fee of 1 DUSK per transaction. Your bridged amount will be **original amount - 1 DUSK**.

## Troubleshooting

- **Nothing arrived on BSC after ~15 minutes**: confirm your Dusk transfer succeeded and double-check the memo contains the correct `0x...` address.
- **I used the wrong memo address**: the bridge can’t mint to an unknown target. This is usually not reversible.
- **I bridged to an exchange address**: only do this if the exchange explicitly supports BEP20 DUSK deposits and you’re sure the memo address is correct.
