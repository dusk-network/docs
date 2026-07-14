---
title: Bridge DUSK from Dusk mainnet to BSC
description: Move DUSK from Dusk mainnet to BEP20 DUSK on BNB Smart Chain.
---

Send DUSK to the official bridge account through the Web Wallet to receive BEP20 DUSK at a specified BNB Smart Chain (BSC) address.

## At a glance

| | |
|---|---|
| Direction | Dusk mainnet to BSC |
| Interface | [Mainnet Web Wallet](https://apps.dusk.network/wallet/) |
| Destination asset | BEP20 DUSK |
| Typical time | Around one hour |
| Cost | Dusk transaction fee plus a 1 DUSK bridge fee |

To move ERC20 or BEP20 DUSK in the other direction, use the [mainnet migration guide](/learn/guides/mainnet-migration/).

:::caution
The memo determines which BSC address receives the BEP20 DUSK. A missing or invalid memo cannot be processed automatically and may make the transfer unrecoverable.
:::

## Before you start

You need:

- access to the [Web Wallet](https://apps.dusk.network/wallet/);
- more than 1 DUSK, plus enough DUSK for the network transaction fee; and
- a BSC address that you control, beginning with `0x`.

The bridge deducts 1 DUSK from the amount sent. The minimum useful transfer is therefore `1.000000001 DUSK`, which delivers `0.000000001 DUSK` on BSC.

## Bridge your DUSK

1. Open the [Web Wallet](https://apps.dusk.network/wallet/), unlock your wallet, and open **Send**.
2. Enter the official BSC bridge account as the recipient:

   ```text
   24jFms4JqYdWb19jFn3CUjNUQz1AeRozYnwsHuUkLbXAj2gRBq598aLAJmqmsaPcsCNJTgTaJTaUZCXpT3s9UeWBsHTmd5hQx95JymZSUsmtwoibiB8AMp4bZjAiLMjmAH3x
   ```

3. In **Memo**, enter the BSC address where you want to receive BEP20 DUSK.
4. Enter an amount greater than 1 DUSK.
5. On the review screen, compare the full bridge account and memo address with the values you intended, then send the transaction.

The Web Wallet detects the bridge account and requires an EVM-formatted memo, but you remain responsible for checking that the destination address is yours.

## Verify the bridge

First confirm that the transfer succeeded in the [Dusk mainnet explorer](https://apps.dusk.network/explorer/). The BEP20 DUSK should then appear at the memo address on BSC. The amount received is the amount sent minus the 1 DUSK bridge fee.

Processing normally takes around one hour. Network or operator conditions can extend that time.

## Troubleshooting

**Nothing arrived after around one hour**

Confirm that the Dusk transaction succeeded and that its memo contains the intended BSC address. Retain the Dusk transaction hash when seeking support.

**The amount sent was 1 DUSK or less**

No BSC payout is expected because the amount does not exceed the 1 DUSK bridge fee.

**The memo is missing or incorrect**

The transfer cannot be routed automatically. Do not submit another transfer until you have checked the first transaction and its memo.

**The destination is an exchange address**

Only bridge directly to an exchange when it explicitly supports BEP20 DUSK deposits to that exact address. Otherwise, use a self-custodial BSC wallet.
