---
title: Manually re-sync your node
description: Learn how to force a Dusk node resync when it becomes stuck on a fork.
---

Resyncing a Dusk node is sometimes a necessary procedure if your node experiences issues such as getting stuck on a block or if there's a need to recover from a network split. Below is a detailed guide on how to manually resync your Dusk node. Before proceeding, ensure you have access to your node's console and necessary permissions to execute the commands.

## Preliminary Check: Determine the Need for Resync

Before initiating a resync, confirm if your node is indeed stuck or lagging behind the network. Execute the following command to check your current block height:

```sh
ruskquery block-height
```

Compare the output with the latest block height available on the [Dusk Network Explorer](https://explorer.dusk.network/).

## Steps to Resync Your Node

If your node is confirmed to be stuck (e.g. at block 50636) or significantly behind the current block height, follow these steps to resync:

### 1. Unstake (if applicable)

If you are staked, the first step is to unstake to prevent any potential loss of stake due to node downtime:

```sh
rusk-wallet unstake
```

### 2. Stop the Rusk Service

Stop the Rusk service to prevent any new data from being written to the database:

```sh
service rusk stop
```

### 3. Use the fast syncing tool

Retrieve the latest published state through the fast syncing tool:
```sh
download_state
```

For more details see the [fast syncing page](/operator/guides/fast-sync).

### 4. Restart Rusk

With the old data removed, restart the Rusk service to begin syncing from scratch:

```sh
service rusk start
```

### 5. Monitor Sync Progress

Monitor the progress of your node's sync by checking the last block accepted by your node:

```sh
ruskquery block-height
```

### 6. Restake (if applicable)

Once your node is close to the current block height, you can restake your DUSK tokens:

```sh
rusk-wallet stake --amt <amount>
```
Replace `<amount>` with the number of DUSK tokens you wish to stake.

## Conclusion

Following these steps should successfully resync your Dusk node with the network. It's crucial to periodically check your node's health and sync status to ensure it remains in good standing within the network. For more information and updates on the Dusk Network, refer to the [official GitHub page](https://github.com/dusk-network/rusk).
