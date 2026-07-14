---
title: Troubleshoot a node
description: Diagnose Rusk startup, connectivity, synchronization, state, and wallet problems.
---

Start with current evidence instead of resetting state immediately:

```sh
systemctl is-active rusk
sudo systemctl status rusk --no-pager
ruskquery info
ruskquery peers
ruskquery block-height
sudo tail -n 100 /var/log/rusk.log
```

## Rusk will not start

Inspect systemd and recovery output:

```sh
sudo journalctl -u rusk --since "30 minutes ago" --no-pager
sudo tail -n 100 /var/log/rusk_recovery.log
```

Common pre-start failures include:

| Message or symptom | Action |
|---|---|
| Missing `consensus.keys` | Install the intended key at `/opt/dusk/conf/consensus.keys` with `root:dusk` ownership and mode `640`. |
| `DUSK_CONSENSUS_KEYS_PASS` not set | Run `sudo sh /opt/dusk/bin/setup_consensus_pwd.sh`; do not place the password in shell history or logs. |
| Rusk restarts every ten seconds | Read the first failure in `journalctl` and `rusk_recovery.log` instead of waiting through repeated restarts. |
| Port already in use | Identify the listener with `sudo ss -ltnup`; stop or reconfigure the conflicting service. |

The installer-managed unit writes Rusk output to `/var/log/rusk.log`; systemd logs service transitions and pre-start failures.

## No peers or chain progress

Check the local network identity and sample height twice:

```sh
ruskquery info | jq '{version, chain_id, kadcast_address}'
ruskquery peers
ruskquery block-height
sleep 30
ruskquery block-height
```

Then verify:

- the node uses the intended mainnet or testnet configuration;
- inbound `9000/udp` reaches the Kadcast public address;
- NAT overrides in `/opt/dusk/services/rusk.conf.user` are correct; and
- the host has working DNS, outbound HTTPS, and UDP connectivity.

Public `8080/tcp` access is not required for consensus. It is only needed when the node intentionally serves HTTP API clients.

`NETWORK MISMATCH` from an individual peer can be ignored when your own `chain_id` is correct and the node otherwise progresses. Repeated `too far in the future` messages usually mean the node is far behind or on the wrong network. A persistent `chain.stalled` condition requires checking peers, height, version, and Kadcast reachability before replacing state.

## State or storage errors

If the node is behind but advancing, keep monitoring. If it remains stalled on unusable state, follow [Re-sync a node](/operator/guides/manual-resync/):

```sh
download_state --list
sudo download_state
sudo systemctl start rusk
```

Do not delete `chain.db`, individual state files, or archive databases while Rusk is running. `ruskreset` also deletes wallet cache, archive data, and diagnostic logs; use it only when an announced reset or support procedure explicitly requires it.

When disk space is exhausted, stop Rusk before moving data. Expand or replace the volume, preserve file ownership, then start and verify the service. Blindly deleting state is not a disk-cleanup strategy.

## Wallet and staking errors

If Rusk Wallet reports that its Rusk connection failed, verify the local service and API first:

```sh
systemctl is-active rusk
curl -si -X POST "http://127.0.0.1:8080/on/node/info" | head
```

A Rusk response includes a `Rusk-Version` header. HTML, an unrelated `404`, or no listener indicates a port conflict or disabled local API.

Use the installed CLI help as the command reference for that wallet version:

```sh
rusk-wallet --version
rusk-wallet --help
rusk-wallet stake --help
```

Do not update Rusk Wallet by cloning and compiling the Rusk repository on an installer-managed node. Rerun the [node upgrade procedure](/operator/guides/upgrade-node/) with the node's existing network and feature flags.

For active stake, owner separation, fault diagnosis, or penalties, see [Slashing recovery](/operator/guides/slashing-recovery/).

## Still unresolved

Preserve the relevant timestamps, Rusk and installer versions, chain ID, local and network heights, peer count, and log excerpt. Remove keys, passwords, mnemonics, IPs you consider private, and other secrets before sharing diagnostics.
