---
title: ERC20/BEP20 Migration
description: Detailed instructions for migrating your ERC20/BEP20 DUSK tokens to Dusk mainnet.
---

This guide explains how to migrate **ERC20/BEP20 DUSK** (Ethereum/BSC) to **native DUSK** on Dusk mainnet. The migration flow is handled through the [Web Wallet](https://apps.dusk.network/wallet/) and uses WalletConnect to connect your EVM wallet.

The migration process locks your ERC20/BEP20 DUSK in a smart contract on Ethereum or Binance Smart Chain. Once locked, an event is emitted and native DUSK is issued to your Dusk wallet. The entire process typically takes around 15 minutes.

:::note
Want to bridge **native DUSK to BEP20 DUSK** on BSC instead? See: [Native DUSK to BEP20 Bridge](/learn/guides/bep20-bridge).
:::

## Who this is for

- You hold DUSK on Ethereum (ERC20) or Binance Smart Chain (BEP20).
- You want to use that DUSK on Dusk mainnet (native DUSK).

## What you need

- A Dusk wallet (in the Web Wallet) where you want to receive native DUSK.
- An EVM wallet holding ERC20/BEP20 DUSK that supports WalletConnect.
- ETH or BNB to pay the Ethereum/BSC transaction fee for the lock transaction.

## Expected time and fees

- **Time**: typically ~15 minutes once your Ethereum/BSC transaction is confirmed.
- **Fees**: you pay the normal Ethereum/BSC network fee to submit the lock transaction.

## Steps

1. Access the [Web Wallet](https://apps.dusk.network/wallet/).
2. Import an existing wallet or create a new one.
3. You will be asked to initiate the migration. Review and confirm the process.
4. Connect your Web3 wallet via WalletConnect.
5. Confirm the transaction in your Web3 wallet. A migration function will be triggered with your Dusk mainnet wallet address as the target address.

Wait for the issuance of your native DUSK tokens. This process can take up to 15 minutes for security reasons.

## FAQ

**How long does the migration process take?**

The migration process typically completes within 15 minutes from the time you initiate the transaction. It will depend on network activity on both chains.

**How can I track my migration transaction?**

You can track the migration transaction in your Web3 wallet on Ethereum or Binance Smart Chain. Once the migration is complete, the original Ethereum/Binance Smart Chain transaction hash will be included in the memo field of the Dusk transaction for reference.

**Is there a minimum amount of DUSK I can migrate?**

Yes, the minimum migration amount is 1 LUX, which is equivalent to 1000000000 DUSK wei. Any amount below this will not be accepted by the migration contract.

**What happens if I migrate smaller fractions?**

If you attempt to migrate an amount of DUSK that is not a clean multiple of 1 LUX (1000000000 DUSK wei), the migration contract will round down the amount. For example:
If you migrate 1234567890 DUSK in wei (ERC20/BEP20), the contract will round it down to 1000000000 DUSK in wei, which is exactly 1 LUX in native DUSK.

This rounding behavior ensures that only full LUX amounts are migrated to native DUSK, as native DUSK uses 9 decimals while ERC20/BEP20 DUSK uses 18 decimals.

## Troubleshooting

- **My migration transaction is pending or failed**: check it in your EVM wallet and ensure you have enough ETH/BNB for gas.
- **I don’t see native DUSK after ~15 minutes**: confirm the Ethereum/BSC lock transaction is successful and give it a bit more time during congestion.
- **My migrated amount is smaller than expected**: amounts are rounded down to full `LUX` (see above).
- **I’m trying to migrate from an exchange**: exchanges usually can’t connect via WalletConnect. Withdraw your DUSK to a self-custody wallet first.
