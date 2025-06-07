---
title: Fast-sync your node
description:  Speed up your Dusk node synchronization by leveraging pre-available snapshot.
---

The node installer comes with an easy to use fast syncing tool. To significantly reduce the time required to sync your node to the latest published state, you can use the `download_state` command. This command stops your node and replaces its current state with the latest published state from one of Dusk's archive nodes.

## Available states

To see the available published states, run:
```sh
download_state --list
```

## Download state

To install the latest state, simply run:
```sh
download_state
```

Once it tells you the operation is complete, run the following command to start your node again:
```sh
service rusk start
```

This process bootstraps your node with the latest available state snapshot, allowing it to sync the remaining blocks much faster than starting from genesis.

:::note
If you are experiencing errors in downloading the state, it might be due to some remnants of previous state syncing. Try to clean up with:
```sh
sudo rm /tmp/state.tar.gz
```
:::