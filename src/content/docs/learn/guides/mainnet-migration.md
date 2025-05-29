---
title: BEP20/ERC20 Migration
description:  Detailed instructions for migrating your ERC20/BEP20 DUSK tokens to Dusk mainnet.
---

This guide provides instructions on how to migrate your BEP20/ERC20 DUSK tokens to native DUSK on the Dusk network. The migration process is facilitated through our [Web Wallet](https://apps.dusk.network/wallet/), allowing you to convert your tokens using WalletConnect-compatible Web3 wallets.

The migration process locks your BEP20/ERC20 DUSK tokens in a smart contract on Ethereum or Binance Smart Chain. Once locked, an event is emitted, and native DUSK is issued to your Dusk mainnet wallet. The entire process typically takes around 15 minutes.

## Migration Steps

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
If you migrate 1234567890 DUSK in wei (BEP20/ERC20), the contract will round it down to 1000000000 DUSK in wei, which is exactly 1 LUX in native DUSK.

This rounding behavior ensures that only full LUX amounts are migrated to native DUSK, as native DUSK uses 9 decimals while BEP20/ERC20 DUSK uses 18 decimals.
