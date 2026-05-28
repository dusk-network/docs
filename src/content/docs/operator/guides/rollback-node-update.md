---
title: Roll back a node update
description: Learn how to reinstall a previous Dusk node installer release when an update needs to be rolled back.
---

Rolling back means reinstalling a previous `node-installer` release. This can be useful if a newly installed node release has a problem and the network has not yet activated a protocol change that requires it.

:::caution
Do not roll back across a network upgrade or activation unless the Dusk team explicitly instructs operators to do so. If the chain already requires the newer node version, an older node may stop following the network.
:::

## Before you roll back

Check the version currently installed:

```sh
ruskquery version
```

Check whether the node is syncing:

```sh
ruskquery block-height
tail -n 50 /var/log/rusk.log
```

If the node is only stuck or behind, try [fast-sync](/operator/guides/fast-sync) or [manual resync](/operator/guides/manual-resync) before rolling back.

## Roll back mainnet

Replace `vX.Y.Z` with the installer release you want to roll back to.

```sh
INSTALLER_VERSION="vX.Y.Z"

sudo service rusk stop

curl --proto '=https' --tlsv1.2 -sSfL \
  "https://github.com/dusk-network/node-installer/releases/download/${INSTALLER_VERSION}/node-installer.sh" \
  | sudo bash

sudo service rusk start
```

## Roll back testnet

Use the same pinned installer release, but pass the testnet flag.

```sh
INSTALLER_VERSION="vX.Y.Z"

sudo service rusk stop

curl --proto '=https' --tlsv1.2 -sSfL \
  "https://github.com/dusk-network/node-installer/releases/download/${INSTALLER_VERSION}/node-installer.sh" \
  | sudo bash -s -- --network testnet

sudo service rusk start
```

## Verify the rollback

Confirm the installed version:

```sh
ruskquery version
```

Check the service:

```sh
service rusk status
```

Check whether the node is progressing:

```sh
ruskquery block-height
tail -F /var/log/rusk.log
```

If block height does not progress, compare your height with the explorer and consider [fast-syncing the node](/operator/guides/fast-sync).

## Notes

- Use a pinned installer release URL. Do not use `latest` for rollback.
- Rollback changes the installed node software and service configuration. It does not automatically restore an older chain state.
- Archive nodes may have database migrations that are not safe to downgrade. If an archive node fails after rollback, update back to the supported version or resync the archive state.
- If you operate a provisioner, monitor the node after rollback. Downtime or running an incompatible version can affect consensus participation. See [Slashing prevention and recovery](/operator/guides/slashing-recovery).
