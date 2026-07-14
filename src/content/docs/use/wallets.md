---
title: Wallets
description: Compare official and community wallets for Dusk browser, dApp, command-line, and operator workflows.
---

Choose a wallet based on how you plan to use Dusk.

| Wallet | Status | Best for |
|---|---|---|
| [Dusk Wallet](#dusk-wallet) | Official | Browser extension, self-custody, and dApp connections |
| [Web Wallet](#web-wallet) | Official | Browser transfers, migration, and bridge workflows |
| [Rusk Wallet](#rusk-wallet) | Official | CLI, automation, staking, operators, and DuskVM contracts |
| [Piewallet](#community-wallets) | Community | Pieswap and combined Dusk/DuskEVM wallet workflows |

## Dusk Wallet

Dusk Wallet is the official self-custodial browser extension. It manages public and shielded DUSK, connects to compatible applications, and presents connection, transaction, and signature requests for approval.

Install it from the official listing for your browser:

- [Chrome Web Store](https://chromewebstore.google.com/detail/dusk-wallet/gcbboponngpmioapekmkajmffefaacld)
- [Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/dusk-wallet/)

Developers integrating wallet connections should use [Dusk Connect](/developer/integrations/dusk-connect/). Extension-specific development details are in [Dusk Wallet Integration](/developer/integrations/wallet-extension/).

## Web Wallet

The official Web Wallet runs in the browser and supports public and shielded transfers. It also provides the interfaces used by the migration and bridge guides.

- [Mainnet Web Wallet](https://apps.dusk.network/wallet/)
- [Testnet Web Wallet](https://apps.testnet.dusk.network/wallet/)
- [Migrate ERC20 or BEP20 DUSK to Dusk mainnet](/learn/guides/mainnet-migration/)
- [Bridge DUSK from Dusk mainnet to BSC](/learn/guides/bep20-bridge/)
- [Bridge testnet DUSK between the Dusk L1 and DuskEVM](/learn/guides/duskevm-bridge/)

## Rusk Wallet

`rusk-wallet` is the official command-line wallet for automation, terminal-first workflows, staking, node operations, and DuskVM contract transactions.

Use the versioned upstream documentation and local help as the command reference:

- [Rusk Wallet README](https://github.com/dusk-network/rusk/blob/master/rusk-wallet/src/bin/README.md)
- [Rusk releases](https://github.com/dusk-network/rusk/releases?q=rusk+wallet&expanded=true)
- `rusk-wallet --help` and `rusk-wallet <command> --help`

For specific workflows, see [node wallet setup](/operator/guides/node-wallet-setup/), [run a provisioner](/operator/provisioner/), or the [DuskVM quickstart](/developer/duskvm/quickstart/).

## Community wallets

[Piewallet](https://chromewebstore.google.com/detail/piewallet/fpaajdmdhkhfedemboncmcmckkhnnike) is offered by Piecrust for Pieswap and Dusk-compatible networks. It is not operated by Dusk. See [Ecosystem](/learn/ecosystem/) for more community projects.

## Wallet safety

- Install wallet extensions only from verified listings and check the publisher.
- Never share a recovery phrase or private key.
- Review every connection, signature, and transaction request before approving it.
- Evaluate community software independently before storing funds or granting account access.
