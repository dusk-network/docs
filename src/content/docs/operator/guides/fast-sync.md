---
title: Fast-sync a node
description: Replace local chain state with a published mainnet or testnet snapshot.
---

The node installer provides `download_state` for mainnet and testnet. It downloads a published state, stops Rusk, replaces the local state and chain database, and leaves the service stopped for operator verification.

:::caution
Fast sync replaces current chain state under `/opt/dusk/rusk`. It does not replace consensus keys or node configuration, but you should still verify you selected the intended network before confirming.
:::

Fast sync does not backfill archive indexes for blocks before the snapshot. Do not use a state snapshot alone to bootstrap an archive node that promises complete historical data.

## List snapshots

The command detects the network from `/opt/dusk/conf/rusk.toml`:

```sh
download_state --list
```

Override detection only when necessary:

```sh
download_state --network testnet --list
```

## Replace state

Download the latest snapshot:

```sh
sudo download_state
```

Or select one of the listed block heights:

```sh
sudo download_state <BLOCK_HEIGHT>
```

The tool downloads to a unique temporary file and removes it afterward. A successful command still leaves Rusk stopped.

## Restart and verify

```sh
sudo systemctl start rusk
systemctl is-active rusk
ruskquery peers
ruskquery block-height
```

Check the height again after roughly 30 seconds. The node should continue syncing from the snapshot toward the current [network tip](/operator/networks/).

If the service fails, inspect `systemctl status rusk`, `/var/log/rusk.log`, and `/var/log/rusk_recovery.log` before retrying. See [Re-sync a node](/operator/guides/manual-resync/) for the decision process.
