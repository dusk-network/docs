---
title: Slashing prevention and recovery
description: Diagnose provisioner penalties, restore healthy operation, and reduce soft- and hard-slashing risk.
---

Dusk applies different penalties to failed participation and provably invalid consensus behavior:

- **Soft penalties** can suspend eligibility and move part of active stake into locked stake. Locked stake remains owned and can be unstaked.
- **Hard penalties** can suspend eligibility and burn part of the stake. Burned stake cannot be recovered by restarting or restaking.

Failed participation is usually an operational problem. Common causes include:

- Running an outdated or incompatible node version.
- Being offline for too long.
- Falling behind the network tip.
- Network or firewall problems that prevent consensus messages from being sent or received.
- Consensus key or node configuration issues.

Hard penalties apply to invalid consensus votes and equivocation, including signing conflicting proposals or votes. Running the same consensus key on multiple active nodes can cause this behavior and must be avoided.

## If your provisioner was slashed

Start by restoring healthy node operation. Slashing is a symptom; the first priority is to make sure the node is on the right chain, on the right version, and progressing.

### 1. Check the installed version

```sh
ruskquery info | jq -r '.version'
ruskquery version
```

The first command reports the running Rusk version; the second checks the installed node-installer release.

If the network has a required release, follow [Upgrade a node](/operator/guides/upgrade-node/) with the existing network and feature flags. This is especially important for archive nodes.

If a newly installed release is known to be problematic and the network can still run the previous version, follow [Rollback a node update](/operator/guides/rollback-node-update).

### 2. Check sync status

```sh
ruskquery block-height
```

Compare the height with the explorer. If a default node is stuck or far behind, use [fast-sync](/operator/guides/fast-sync):

```sh
sudo download_state
sudo systemctl start rusk
```

For an archive node that requires complete historical indexes, follow the archive-specific [re-sync guidance](/operator/guides/manual-resync/#restore-a-published-state) instead.

### 3. Check service status and logs

```sh
systemctl status rusk
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

### 6. Unstake and restake only after the node is healthy

If the node is on the right version, fully synced, operating normally, and the consensus key is active on only one node, unstake and restake when needed to create a new provisioner position.

Restaking starts a new activation period. It does not restore stake burned by a hard penalty, so identify the underlying cause before submitting either transaction.

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
- Never run the same consensus key on multiple active nodes.
- Avoid running experimental or mismatched binaries on a staked provisioner.
- Use [fast-sync](/operator/guides/fast-sync) for a default node when state recovery is required; preserve complete-history requirements for archive nodes.

## Related guides

- [Upgrade a node](/operator/guides/upgrade-node)
- [Roll back a node update](/operator/guides/rollback-node-update)
- [Fast-sync a node](/operator/guides/fast-sync)
- [Troubleshooting](/operator/troubleshooting)
