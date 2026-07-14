---
title: Re-sync a node
description: Diagnose a stalled node and restore it from a supported state snapshot.
---

Re-sync only after confirming the node is stalled or on unusable local state. A node that is behind but continuing to advance usually needs time, not state replacement.

## Confirm the problem

```sh
systemctl is-active rusk
ruskquery info | jq '{version, chain_id, kadcast_address}'
ruskquery peers
ruskquery block-height
sleep 30
ruskquery block-height
sudo tail -n 100 /var/log/rusk.log
```

Compare the local height and chain ID with the selected [network](/operator/networks/). Fix service, version, peer, firewall, or wrong-network problems before replacing valid state.

## Restore a published state

For a default mainnet or testnet node, use the installer-managed fast-sync tool:

```sh
download_state --list
sudo download_state
sudo systemctl start rusk
```

Then verify service state, peers, and increasing block height. See [Fast-sync a node](/operator/guides/fast-sync/) for snapshot selection and network overrides.

For an archive node, a state snapshot does not reconstruct pre-snapshot historical indexes. Restore a known-good backup that includes the archive databases or synchronize the archive from genesis when complete history is required.

Routine re-sync does not require unstaking. Keep the recovery window short and monitor provisioner faults. If the node will remain unavailable, its keys may be compromised, or penalties are increasing, follow [Slashing recovery](/operator/guides/slashing-recovery/).

## Full reset

`ruskreset` deletes local state, archive data, wallet cache, and Rusk logs. It is not the first response to ordinary lag or a recoverable snapshot failure.

Use it only when a network reset announcement or Dusk support procedure explicitly requires a full reset. Preserve diagnostic logs before running it, confirm the selected network, and be prepared to synchronize state again afterward.
