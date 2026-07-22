---
title: Maintain and monitor a node
description: Check node health, plan maintenance, and respond to common operational failures.
---

Monitor a Dusk node from both the host and an external system. A running process alone is not enough: the node must have peers, advance with the network, and retain enough disk and memory headroom.

## Check node health

Run these checks after installation, upgrades, reboots, and alerts:

| Signal | Command | Healthy result |
|---|---|---|
| Service | `systemctl is-active rusk` | `active` |
| Restart count | `systemctl show rusk -p ActiveState -p SubState -p NRestarts` | Active, running, and not repeatedly restarting |
| Rusk version and network | `ruskquery info` | Expected `version`, `chain_id`, and Kadcast address |
| Peers | `ruskquery peers` | Non-zero and reasonably stable |
| Chain progress | `ruskquery block-height` | Height increases and remains close to the network tip |
| Installer version | `ruskquery version` | Current installer release |

`ruskquery version` checks the installer, not the running Rusk binary. Read the Rusk version from `ruskquery info` or run `rusk --version`.

Sample the local height more than once:

```sh
ruskquery block-height
sleep 30
ruskquery block-height
```

An unchanged sample is not conclusive by itself. Alert when the local height remains unchanged while the public network advances, or when its lag keeps increasing.

To read the mainnet tip independently:

```sh
curl -fsS -X POST "https://nodes.dusk.network/graphql" \
  -H "Content-Type: application/json" \
  --data-raw '{"query":"{ block(height: -1) { header { height } } }"}' \
  | jq -r '.data.block.header.height'
```

Use `https://testnet.nodes.dusk.network/graphql` for testnet.

## Inspect resources and logs

```sh
df -h /opt/dusk /var/log
free -h
uptime
sudo tail -n 200 /var/log/rusk.log
sudo tail -n 100 /var/log/rusk_recovery.log
sudo journalctl -u rusk --since "30 minutes ago" --no-pager
```

The installer rotates `/var/log/rusk*.log` daily, retaining ten compressed rotations. Alert before either the state volume or log volume is exhausted; 80% utilization is a practical warning point when growth is not yet understood.

Alert immediately when:

- the service is inactive or its restart count rises repeatedly;
- the node has no peers beyond a short startup interval;
- block height stops while the selected network continues;
- disk space is close to exhaustion; or
- logs repeatedly report startup, storage, consensus-key, or `chain.stalled` errors.

For a provisioner, also check `rusk-wallet stake-info` from the wallet host and investigate a rising fault count. Do not use reward changes alone as a short-term health check.

## Update Rusk

Use the [node upgrade procedure](/operator/guides/upgrade-node/). The installer stages and verifies new binaries before stopping Rusk, but it does not start the service after installation.

Always rerun the installer with the same network and feature flags used for the node. In particular, an archive node must retain `--feature archive`; omitting it installs the default Rusk binary.

The installer preserves chain state, `consensus.keys`, `/opt/dusk/services/dusk.conf`, and `/opt/dusk/services/rusk.conf.user`. It regenerates managed binaries, the systemd unit, `/opt/dusk/conf/rusk.toml`, `genesis.toml`, helper scripts, and the selected user's wallet configuration. Review the regenerated `rusk.toml` and reapply only intentional local settings instead of restoring an old file wholesale.

## Update the operating system

Use Ubuntu 24.04 LTS, the version supported by the node installer. Apply OS updates during a controlled maintenance window:

```sh
sudo apt update
apt list --upgradable
sudo apt upgrade
```

The node installer installs its own prerequisites but does not perform a full OS upgrade. After package updates, verify Rusk again even when a reboot is not requested.

Ubuntu commonly indicates a required reboot through `/var/run/reboot-required`:

```sh
if [ -f /var/run/reboot-required ]; then
  cat /var/run/reboot-required
fi
```

Before rebooting, confirm the node was healthy and that no second node is using the same consensus key. Then reboot and verify the enabled service after reconnecting:

```sh
sudo systemctl stop rusk
sudo reboot
```

```sh
systemctl is-active rusk
ruskquery peers
ruskquery block-height
```

Keep provisioner downtime brief. If the node does not recover promptly, diagnose it instead of repeatedly rebooting.

## Protect keys and configuration

Keep the owner wallet and recovery material off the node. Back up the consensus key and its password separately, encrypted and access-controlled. Possession of both is sufficient to operate that provisioner.

Never run the same consensus key on two nodes at once. Conflicting consensus messages can cause a hard penalty. When migrating a provisioner, stop and verify the old service before starting the replacement.

Record or securely back up:

- `/opt/dusk/conf/consensus.keys`;
- the consensus-key password stored through `/opt/dusk/services/dusk.conf`;
- intentional overrides in `/opt/dusk/services/rusk.conf.user`; and
- any intentional changes to `/opt/dusk/conf/rusk.toml` that must be reviewed after an installer update.

Chain state under `/opt/dusk/rusk` is replaceable through a published state snapshot. Do not copy a live database as a substitute for key backups.

## Respond to failures

| Symptom | First actions |
|---|---|
| Service will not start | Check `systemctl status rusk`, `journalctl -u rusk`, and `rusk_recovery.log`. Startup checks report missing consensus keys or passwords explicitly. |
| Service runs but height does not advance | Check peers, the selected chain ID, `/var/log/rusk.log`, and `9000/udp` reachability. Compare against the matching public network. |
| Node is behind but advancing | Continue monitoring. Use [fast sync](/operator/guides/fast-sync/) when the gap is operationally significant. |
| State is corrupt or the node remains stalled | Use the supported [fast-sync or re-sync procedure](/operator/guides/manual-resync/). Do not delete individual database files while Rusk is running. |
| Disk is nearly full | Stop Rusk before moving state, expand or replace the volume, then verify ownership and restart. Do not delete current state or archive files blindly. |
| Provisioner faults or penalties increase | Restore node health first, then follow [slashing recovery](/operator/guides/slashing-recovery/). |

The default node requires inbound `9000/udp` for Kadcast. Rusk's HTTP port `8080/tcp` does not need to be public for consensus or local `ruskquery` checks. Keep it private unless the node intentionally serves API traffic, and restrict public access with firewall and application-level controls.

See [Troubleshooting](/operator/troubleshooting/) for symptom-specific commands.
