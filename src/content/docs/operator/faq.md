---
title: FAQ
description: Frequently asked questions about running a node on Dusk.
---

## Basics

#### Which operating system is recommended?

Ubuntu 24.04 LTS.

#### Which node should I run to participate in consensus?

Run a [Provisioner node](/operator/provisioner).

#### Which ports does Dusk use?

- `9000/udp`: Kadcast (required).
- `8080/tcp`: HTTP API (optional, but required if you want to query the node / expose RUES).

You can run on non-default ports as long as you configure them and allow inbound traffic.

#### How do I know if my node is on the correct chain?

Run `ruskquery info` and check the chain ID.

#### How many blocks are there in one epoch?

2160 blocks.

#### Can I run a node without staking?

Yes. You can run a node for syncing, propagation, and APIs without staking, but it will not participate in consensus or earn rewards.

## Staking

#### What is the minimum amount of DUSK I must stake?

1000 DUSK.

#### When does my stake become active?

At the epoch boundary after the next one, between roughly 1 and 2 epochs after the staking transaction. Check `stake active from block` with `rusk-wallet stake-info`. See [Staking on Dusk](/learn/guides/staking-basics/).

#### How do I increase stake or compound rewards?

See [/learn/guides/staking-basics#adding-to-an-existing-stake](/learn/guides/staking-basics#adding-to-an-existing-stake).

## Keys and Recovery

#### Are my keys secure on a server/VPS?

Wallet data is stored encrypted at rest, but you should still treat the node as a hot environment:

- Keep your mnemonic backed up offline.
- Consider using a separate owner key (`rusk-wallet stake --owner ...`) so the consensus key cannot unstake/withdraw.
- Restrict access (firewall, SSH keys only, minimal users, patching).

#### Can I store keys separately from the machine running the node?

Yes. The node only needs the consensus key file (`consensus.keys`). Export it from a wallet instance and copy it to the node. See [/operator/guides/node-wallet-setup#export-consensus-key](/operator/guides/node-wallet-setup#export-consensus-key).

Example (adjust user/IP):

```bash
scp consensus.keys duskadmin@<node-ip>:~/consensus.keys
ssh duskadmin@<node-ip> \
  'sudo install -o root -g dusk -m 640 ~/consensus.keys /opt/dusk/conf/consensus.keys && rm -f ~/consensus.keys'
```

#### What if I lose access to my server or keys?

If you still have your mnemonic, you can restore the wallet on a new machine, re-export `consensus.keys`, and continue. You do not need to stake again.

## Common Tasks

#### How can I stake 3000 DUSK?

```bash
rusk-wallet stake --amt 3000
```

#### How can I recover my node if the state is corrupted?

For a default mainnet or testnet node, reload from a snapshot and restart:

```bash
sudo download_state
sudo systemctl start rusk
```

For an archive node that requires complete history, follow the archive-specific [re-sync guidance](/operator/guides/manual-resync/#restore-a-published-state).

#### How can I run a Dusk node on Docker?

We don't support a production-ready Docker image. For ephemeral (non-persistent) usage:

```bash
docker run -p 9000:9000/udp -p 8080:8080/tcp dusknetwork/node
```

#### How do I configure Kadcast to use a port other than 9000/udp?

If you're using the node installer, set overrides in `/opt/dusk/services/rusk.conf.user`:

```bash
KADCAST_PUBLIC_ADDRESS=<MY_WAN_IPV4>:<NEW_PORT>
# Optional (common behind NAT)
KADCAST_LISTEN_ADDRESS=<MY_LAN_IPV4>:<NEW_PORT>
```

Without the node installer, configure `rusk.toml`:

```toml
[kadcast]
public_address = "<MY_WAN_IPV4>:<NEW_PORT>"
listen_address = "<MY_LAN_IPV4>:<NEW_PORT>" # Optional
```

Retain the bootstrapping nodes supplied for the selected network.

#### How do I change the HTTP API port?

In `rusk.toml`:

```toml
[http]
listen = true
listen_address = "127.0.0.1:8081"
```

The installer regenerates `rusk.toml` during upgrades, so review and reapply this setting afterward. Bind an external interface only when required, and restrict public API traffic.

#### How can I get data from testnet or mainnet nodes?

See [/developer/integrations/http-api](/developer/integrations/http-api) and [/developer/integrations/historical_events](/developer/integrations/historical_events).

#### How can I perform a liveness check on my node?

- `ruskquery block-height` (should increase over time)
- `ruskquery peers`
- `systemctl is-active rusk`
- `ruskquery info`

See [Maintain and monitor a node](/operator/maintenance-monitoring/) for network-tip comparison, resources, logs, and alerts.
