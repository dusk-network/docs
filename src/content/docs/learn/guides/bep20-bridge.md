---
title: Native DUSK to BEP20 Bridge
description: How to bridge your native DUSK tokens to BEP20 DUSK on Binance Smart Chain.
---

This guide explains how to bridge your **native DUSK** tokens to **BEP20 DUSK** on Binance Smart Chain (BSC). This operation is handled through the official **BEP20 bridge** and facilitated via the [Dusk Web Wallet](https://apps.dusk.network/wallet/).

When bridging, your native DUSK tokens are locked on the Dusk network. Once locked, a mint operation is initiated on Binance Smart Chain, issuing an equivalent amount of BEP20 DUSK to your specified address. The full bridging process typically completes within 15 minutes.

:::note[Note]
Want to **bridge from BEP20 DUSK to native DUSK** instead? Check our [Migration Guide](/learn/guides/mainnet-migration/) for the complete walkthrough.
:::

## Bridging Steps

1. Open the [Web Wallet](https://apps.dusk.network/wallet/).
2. Open or import your native Dusk wallet.
3. Navigate to the **Send** tab.
4. Enter the official **Bridge Address** as the recipient:
```
22cZ2G95wTiknTakS1of6UXUTMkvNrYf8r2r3fmvp2hQx1edAULWvYF67xDqxRn2b44tJZo7JpMsWYUHj5CA2M4RkjX7rQ7vAfSpr7SHe6dnfmucEGgwr46auwdx3ZAgMCsH
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
