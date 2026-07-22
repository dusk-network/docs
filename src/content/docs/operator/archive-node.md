---
title: Run an archive node
description: Install and operate a Rusk node with finalized historical indexes.
---

An archive node runs the archive build of Rusk and retains finalized historical indexes in addition to normal chain state. Applications use it for queries such as `moonlightHistory`, `fullMoonlightHistory`, and `finalizedEvents`.

Archive mode does not require staking. An archive node can also participate in consensus, but production API infrastructure is usually kept separate from provisioner duties so query load and maintenance do not compete with consensus.

## Requirements

Use Ubuntu 24.04 LTS and begin with at least:

| CPU | RAM | Storage | Network |
|---|---|---|---|
| 4 cores at 2 GHz | 8 GB | 500 GB | 100 Mbps |

This is an initial planning baseline, not a capacity guarantee. Archive storage grows over time; monitor actual utilization and expansion lead time.

## Install

Run the released node installer with the archive feature:

```sh
curl --proto '=https' --tlsv1.2 -sSfL \
  https://github.com/dusk-network/node-installer/releases/latest/download/node-installer.sh \
  | sudo bash -s -- --feature archive
```

Add `--network testnet` before `--feature archive` for a testnet archive node.

Start Rusk and monitor synchronization:

```sh
sudo systemctl start rusk
systemctl is-active rusk
ruskquery peers
ruskquery block-height
```

Compare the height with the matching [network](/operator/networks/).

An archive expected to answer complete history must synchronize from genesis or restore a trusted backup that includes the archive databases. The installer's `download_state` snapshot restores execution state, but it does not backfill archive indexes for blocks before that snapshot.

## Enable the HTTP API

The installed API is not intended to be public by default. For local access or a reverse proxy on the same host, add this to `/opt/dusk/conf/rusk.toml`:

```toml
[http]
listen = true
listen_address = '127.0.0.1:8080'
```

Then restart Rusk:

```sh
sudo systemctl restart rusk
```

Use `0.0.0.0:8080` only when the API must accept traffic on an external interface. Restrict it with a firewall, access policy, rate limits, or a controlled reverse proxy. Public `8080/tcp` access is not required for synchronization or consensus.

:::caution[Updates regenerate rusk.toml]
Rerun the installer with `--feature archive` during every update. The installer regenerates `/opt/dusk/conf/rusk.toml`, so review the new file and reapply the intended `[http]` settings before returning the API to service.
:::

## Verify archive queries

List the archive fields exposed by canonical GraphQL:

```sh
curl -fsS -X POST "http://127.0.0.1:8080/graphql" \
  -H "Content-Type: application/json" \
  --data-raw '{"query":"{ __schema { queryType { fields { name } } } }"}' \
  | jq -r '.data.__schema.queryType.fields[].name' \
  | grep -E '^(moonlightHistory|fullMoonlightHistory|finalizedEvents|checkBlock)$'
```

Query a known block:

```sh
curl -fsS -X POST "http://127.0.0.1:8080/graphql" \
  -H "Content-Type: application/json" \
  --data-raw '{"query":"{ block(height: 1) { header { height hash } } }"}' \
  | jq .
```

To verify finalized-block lookup, replace `<BLOCK_HASH>` with the returned hash:

```sh
curl -fsS -X POST "http://127.0.0.1:8080/graphql" \
  -H "Content-Type: application/json" \
  --data-raw '{"query":"{ checkBlock(height: 1, hash: \"<BLOCK_HASH>\", onlyFinalized: true) }"}' \
  | jq .
```

Archive history is populated as blocks finalize. Verify the earliest range your application requires before declaring the service ready.

See [Scan Moonlight deposits](/developer/integrations/historical_events/) for a bounded history consumer and [HTTP API](/developer/integrations/http-api/) for query and access-policy details.

## Stake from an archive node

Staking is optional. If this host will also be a provisioner, follow [Set up the node wallet](/operator/guides/node-wallet-setup/) and apply the same monitoring, key-isolation, and update procedures as any other provisioner.
