---
title: Rusk Wallet
description: Using the Rusk Wallet to leverage CLI functionalities when interacting with Dusk.
---

The [**Rusk Wallet**](https://github.com/dusk-network/rusk/tree/master/rusk-wallet) is a powerful and feature-rich command-line interface (CLI) wallet designed for managing DUSK and interacting directly with the network. 

Latest release is <a href="https://github.com/dusk-network/rusk/releases/tag/rusk-wallet-0.2.0" target="_blank">rusk-wallet-0.2.0</a>.

Users can choose to use either the interactive mode, which offers a menu-driven interface, or execute specific subcommands to perform tasks such as sending funds, managing balances, staking, and interacting with smart contracts.

## Commands Overview

By default, the CLI runs in **interactive** mode when no arguments or subcommands are provided. To start it, simply run:

```bash
rusk-wallet
```

This mode presents users with a menu-driven interface, allowing them to navigate through wallet functions interactively without typing commands manually.

The Rusk Wallet can be also run in **headless mode**, where you specify a subcommand to execute actions directly without needing the interactive interface.

To skip the interactive mode and run in headless mode, provide a subcommand directly:

```bash
rusk-wallet <subcommand>
```
For example:

```bash
rusk-wallet balance
```

The Rusk wallet provides several subcommands for wallet creation, transactions, staking, and more:


| **Subcommand**      | **Description**                                         |
|--------------------|---------------------------------------------------------|
| `create`            | Create a new wallet                                    |
| `restore`           | Restore a lost wallet using the recovery phrase        |
| `balance`           | Check your current DUSK balance                        |
| `history`           | View the transaction history of a wallet address       |
| `transfer`          | Send DUSK through the network                          |
| `shield`            | Convert public DUSK to shielded DUSK                  |
| `unshield`          | Convert shielded DUSK to public DUSK                  |
| `stake`             | Stake DUSK to earn rewards                             |
| `unstake`           | Unstake your DUSK                                      |
| `withdraw`          | Withdraw accumulated staking rewards                   |
| `contract-deploy`   | Deploy a smart contract                                |
| `contract-call`     | Call a contract                                        |
| `export`            | Export your BLS provisioner key-pair                  |
| `settings`          | View current settings                                  |



## Wallet Password

By default, the wallet will prompt you for a password whenever sensitive information needs to be decrypted (e.g., accessing the wallet or exporting keys). If you're running automated scripts or in a headless environment, you can bypass this prompt using the `RUSK_WALLET_PWD` environment variable:

```bash
export RUSK_WALLET_PWD=<your_password>
```

The `RUSK_WALLET_PWD` is used for:

- Wallet decryption (in all commands that use a wallet)
- Wallet encryption (during the wallet creation, in `create`)
- BLS key encryption (in `export`)

## Offline Commands

Some commands can run without an active connection to Rusk. These commands work offline because they rely on locally stored wallet data instead of requiring real-time interaction with the Dusk. Offline commands are particularly useful for setting up or recovering wallets before connecting to the network.

- `create`: Create a new wallet
- `restore`: Restore an existing wallet
- `addresses`: Retrieve wallet addresses
- `export`: Export your BLS provisioner key-pair
  
All other commands, including transactions, require an active connection to a running Rusk instance.

To explore all available commands, you can run:  
```bash
rusk-wallet help
```

## Staking with an owner key

A stake in Dusk is defined by two keys:  
- **Consensus key:** used to participate in consensus.  
- **Owner key:** entitled to unstake or withdraw DUSK.  

By default, the Rusk Wallet uses your wallet’s consensus key as the owner key. If you don't specify an owner, both consensus activities and stake ownership will be tied to the same consensus key.

However, you can override this behavior by passing `--owner <address>`, for example:

```bash
# Stake 2000 DUSK with a custom owner
rusk-wallet stake --amt 2000 --owner ADDo5VBg8q…Kb1jZFmWr
```

Alternatively, you can simply omit the `--owner <address>` flag:
```bash
# Stake 1000 DUSK with a default owner key
rusk-wallet stake --amt 1000
```
so that the owner key is the consensus key.

:::note[Important]
if you choose a non-consensus key as the owner, keep in mind that only that owner key can later unstake or withdraw those funds.
:::