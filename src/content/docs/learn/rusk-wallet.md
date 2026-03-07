---
title: Rusk Wallet
description: "The official CLI wallet for Dusk: scripting, staking, and operator workflows."
---

`rusk-wallet` is the official command-line wallet for Dusk. Use it when you want automation, terminal-first workflows, or node/operator tasks.

If you prefer a UI for everyday transfers, use the [Web Wallet](/learn/web-wallet).

Use these as the source of truth for your installed version:

- The upstream CLI reference:
  <a href="https://github.com/dusk-network/rusk/blob/master/rusk-wallet/src/bin/README.md" target="_blank" rel="noreferrer">rusk-wallet/src/bin/README.md</a>
- The current releases:
  <a href="https://github.com/dusk-network/rusk/releases?q=rusk+wallet&expanded=true" target="_blank" rel="noreferrer">Rusk releases</a>
- Your local help output:
  `rusk-wallet --help` and `rusk-wallet <command> --help`

## Install

- Download a prebuilt binary from the releases page.
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

## Non-interactive use (automation)

Most commands prompt for a wallet password when they need to decrypt secrets. For automation, you can provide it via `RUSK_WALLET_PWD`:

```bash
export RUSK_WALLET_PWD=<your_password>
rusk-wallet balance
```

For exporting provisioner keys in headless environments:

```bash
export RUSK_WALLET_EXPORT_PWD=<export_password>
```

Only do this in controlled environments, and be careful not to leak passwords via shell history, logs, or CI output.

## Operator workflows

If you are using the wallet for provisioner or archive-node operations, see:

- [Node wallet setup](/operator/guides/node-wallet-setup)
- [Provisioner node](/operator/provisioner)
- [Archive node](/operator/archive-node)
