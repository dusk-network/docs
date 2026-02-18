---
title: Rusk Wallet
description: "The official CLI wallet for Dusk: scripting, staking, and operator workflows."
---

`rusk-wallet` is the official command-line wallet for Dusk. Use it when you want automation, terminal-first workflows, or node/operator tasks.

If you prefer a UI for everyday transfers, use the [Web Wallet](/learn/web-wallet).

## Install

- Download a prebuilt binary from the <a href="https://github.com/dusk-network/rusk/releases?q=rusk+wallet&expanded=true" target="_blank" rel="noreferrer">Rusk releases page</a>.
- Or build from source from the <a href="https://github.com/dusk-network/rusk" target="_blank" rel="noreferrer">rusk repo</a>.

## Usage

Run without arguments to start interactive mode:

```bash
rusk-wallet
```

Run a command directly (headless mode):

```bash
rusk-wallet <command> [flags]
```

Discover available commands and flags with:

```bash
rusk-wallet --help
rusk-wallet <command> --help
```

The full CLI command reference lives in the upstream README:
<a href="https://github.com/dusk-network/rusk/blob/master/rusk-wallet/src/bin/README.md" target="_blank" rel="noreferrer">rusk-wallet/src/bin/README.md</a>.

## Common tasks

### Create or restore a wallet

```bash
rusk-wallet create
```

```bash
rusk-wallet restore
```

### Check balance

```bash
rusk-wallet balance
```

### Transfer funds

Use the built-in help for the exact flags:

```bash
rusk-wallet transfer --help
```

### Stake (owner key optional)

A Dusk stake has two roles:

- **Consensus key**: used to participate in consensus.
- **Owner key**: the address that can `unstake` and `withdraw`.

If you don't specify `--owner`, the consensus key is also the owner.

```bash
# Stake with the default owner (consensus key)
rusk-wallet stake --amt 1000

# Stake with a separate owner address
rusk-wallet stake --amt 1000 --owner <OWNER_ADDRESS>
```

For the node-operator flow (exporting consensus keys, staking, and monitoring with `stake-info`), follow: [Wallet setup](/operator/guides/node-wallet-setup).

## Non-interactive use (automation)

Most commands prompt for a wallet password when they need to decrypt secrets. For automation, you can provide it via `RUSK_WALLET_PWD`:

```bash
export RUSK_WALLET_PWD=<your_password>
rusk-wallet balance
```

Only do this in controlled environments, and be careful not to leak passwords via shell history, logs, or CI output.
