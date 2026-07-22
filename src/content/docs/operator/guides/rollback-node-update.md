---
title: Roll back a node update
description: Reinstall a pinned node-installer release when rollback is supported by the network.
---

Rollback installs the Rusk and Rusk Wallet versions pinned by an older node-installer release. Use it only when that software still supports the active network.

:::caution
Do not roll back across a protocol activation unless Dusk explicitly instructs operators to do so. An incompatible node can stop following the network, and an archive database migration may not support downgrade.
:::

## Before rollback

Record the current state and preserve intentional configuration:

```sh
ruskquery version
ruskquery info | jq '{version, chain_id, kadcast_address}'
ruskquery peers
ruskquery block-height
systemctl is-active rusk
```

Confirm that the failure is caused by the installed release. A stalled or corrupt state normally requires [re-sync](/operator/guides/manual-resync/), not older software.

Rollback regenerates the same managed files as an upgrade, including `rusk.toml` and the systemd unit. It preserves consensus keys, protected service environment files, and chain state, but it does not restore an older database snapshot.

## Install a pinned release

Set the node-installer release approved for rollback:

```sh
INSTALLER_VERSION="vX.Y.Z"
```

Use the command matching the node's existing network and role. The installer stages and verifies downloads before stopping Rusk, so do not stop the service first.

### Mainnet provisioner or full node

```sh
curl --proto '=https' --tlsv1.2 -sSfL \
  "https://github.com/dusk-network/node-installer/releases/download/${INSTALLER_VERSION}/node-installer.sh" \
  | sudo bash
```

### Mainnet archive node

```sh
curl --proto '=https' --tlsv1.2 -sSfL \
  "https://github.com/dusk-network/node-installer/releases/download/${INSTALLER_VERSION}/node-installer.sh" \
  | sudo bash -s -- --feature archive
```

### Testnet provisioner or full node

```sh
curl --proto '=https' --tlsv1.2 -sSfL \
  "https://github.com/dusk-network/node-installer/releases/download/${INSTALLER_VERSION}/node-installer.sh" \
  | sudo bash -s -- --network testnet
```

### Testnet archive node

```sh
curl --proto '=https' --tlsv1.2 -sSfL \
  "https://github.com/dusk-network/node-installer/releases/download/${INSTALLER_VERSION}/node-installer.sh" \
  | sudo bash -s -- --network testnet --feature archive
```

For direct root automation, append `--user <operator-user>`.

## Restart and verify

Review regenerated configuration and reapply only intentional settings that remain valid for the older release. Then start Rusk:

```sh
sudo systemctl start rusk
systemctl is-active rusk
ruskquery info | jq '{version, chain_id, kadcast_address}'
ruskquery peers
ruskquery block-height
sudo tail -n 50 /var/log/rusk.log
```

Confirm that height continues to increase and remains close to the selected network. For an archive, verify required historical queries before returning API traffic.

If the older release cannot open current state or archive data, reinstall the supported current release. Do not repeatedly alternate versions against the same database.
