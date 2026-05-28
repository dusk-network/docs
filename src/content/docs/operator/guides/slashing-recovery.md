---
title: Slashing prevention and recovery
description: Learn how Dusk soft slashing affects provisioners and what to check after a slashing event.
---

Dusk uses **soft slashing** to discourage repeated faults and long downtime. Stake is not burned, but a provisioner can lose eligibility or effective participation, which reduces rewards.

Soft slashing can happen when a provisioner repeatedly fails to participate correctly in consensus. Common operational causes include:

- Running an outdated or incompatible node version.
- Being offline for too long.
- Falling behind the network tip.
- Network or firewall problems that prevent consensus messages from being sent or received.
- Consensus key or node configuration issues.

## If your provisioner was slashed

Start by restoring healthy node operation. Slashing is a symptom; the first priority is to make sure the node is on the right chain, on the right version, and progressing.

### 1. Check the installed version

```sh
ruskquery version
```

If the network has a required release, upgrade to it:

```sh
curl --proto '=https' --tlsv1.2 -sSfL https://github.com/dusk-network/node-installer/releases/latest/download/node-installer.sh | sudo bash
sudo service rusk start
```

For testnet:

```sh
curl --proto '=https' --tlsv1.2 -sSfL https://github.com/dusk-network/node-installer/releases/latest/download/node-installer.sh | sudo bash -s -- --network testnet
sudo service rusk start
```

If a newly installed release is known to be problematic and the network can still run the previous version, follow [Rollback a node update](/operator/guides/rollback-node-update).

### 2. Check sync status

```sh
ruskquery block-height
```

Compare the height with the explorer. If the node is stuck or far behind, use [fast-sync](/operator/guides/fast-sync):

```sh
download_state
sudo service rusk start
```

### 3. Check service status and logs

```sh
service rusk status
tail -n 100 /var/log/rusk.log
```

Look for errors related to:

- wrong network or chain mismatch
- consensus key loading
- peer discovery
- Kadcast address or UDP connectivity
- state/database errors

### 4. Check staking status

```sh
rusk-wallet stake-info
```

Confirm that the expected stake is still present and inspect the reported stake state. If the wallet cannot connect, fix node connectivity first.

### 5. Monitor after recovery

After the node is updated, synced, and running, keep the logs open and check the block height repeatedly:

```sh
tail -F /var/log/rusk.log
ruskquery block-height
```

The height should continue to progress. If the node falls behind again, treat it as an unresolved infrastructure or networking issue.

### 6. Unstake and restake if the node is healthy

If the node is on the right version, fully synced, and operating normally, unstake and restake to restore normal provisioner participation.

Slashing can be caused by temporary operational issues, such as cloud provider downtime, network disruption, or downtime during a live node update. If the underlying issue is gone, restaking is the recovery step.

```sh
rusk-wallet unstake
rusk-wallet stake --amt <amount>
```

Replace `<amount>` with the amount you want to stake. The new stake must mature before it starts participating again.

## Prevention checklist

- Keep the node updated during announced network upgrades.
- Monitor `ruskquery block-height` against the explorer.
- Alert on service downtime and repeated restart loops.
- Keep UDP `9000` reachable for Kadcast.
- Keep consensus keys backed up and readable by the Rusk service.
- Avoid running experimental or mismatched binaries on a staked provisioner.
- Use [fast-sync](/operator/guides/fast-sync) when a node falls behind instead of waiting for a long resync from genesis.

## Related guides

- [Upgrade a node](/operator/guides/upgrade-node)
- [Roll back a node update](/operator/guides/rollback-node-update)
- [Fast-sync a node](/operator/guides/fast-sync)
- [Troubleshooting](/operator/troubleshooting)
