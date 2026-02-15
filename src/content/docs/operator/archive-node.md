---
title: Run an archive node
description: Learn about Dusk archive nodes that store and give access to Dusk’s historical data.
---

Archive nodes extend the functionality of [Provisioners](/operator/provisioner) by also preserving a complete historical record of the Dusk blockchain. While Provisioners are focused solely on the current state, archive nodes provide essential long-term data access that supports applications, users, researchers, and auditors who need comprehensive historical information.

Archive nodes play a unique role in the Dusk Network by focusing on data storage and accessibility, rather than participating in consensus. This means they are not required to stake DUSK, as they serve an entirely supportive function for dApps and services that rely on historical records.

In short, archive nodes:
- Provide additional historical data (such as events emitted by contracts) that is not stored by a Provisioner node
- Can participate in consensus, by staking DUSK. However, they are not required to.

:::tip[Run an Archive node]
If you want to quickly launch & run an archive node, you can use the <a href="https://github.com/dusk-network/node-installer" target="_blank">node installer</a> by following [the archive guide](/operator/archive-node).
:::

## Archive Node Specifications

Archive nodes store and serve historical data and require large storage capacity, efficient processing for concurrent requests, and fast Internet connectivity. The following recommended specifications serve as a baseline for Archive Nodes. Over time, storage requirements will increase.

| CPU            | RAM  | Storage | Network Connection |
| :------------- | :--- | :------ | :----------------- |
| 4 cores; 2 GHz | 8 GB | 500 GB  | 100 Mbps           |

## Run an archive node
> A step-by-step guide to setting up a Dusk archive node.

The following guide will explain you how to install and setup an archive node on Ubuntu 24.04 through the [node installer](https://github.com/dusk-network/node-installer). This installer will set up Rusk as a service on your server, preconfigure parts of the node, and provide a couple of helper scripts.

Install Rusk with the archive feature enabled by pasting the following command in your server terminal:
```sh
curl --proto '=https' --tlsv1.2 -sSfL https://github.com/dusk-network/node-installer/releases/latest/download/node-installer.sh | sudo bash -s -- --feature archive
```

This will install an archive node with the network being set to mainnet.

## Configure Rusk

You now should have successfully installed Rusk.

A quick check with:

```sh
ruskquery version
```

Should tell you, that you are running the latest installer version.

## Start your node

If you've configured everything correctly, you can now start rusk:
```sh
service rusk start
```

Your node will now start syncing. You can check if it indeed is by running:
```sh
ruskquery block-height
```

It is best to wait until your node is synced up. You can find the latest block height on [the block explorer](https://explorer.dusk.network/). Alternatively, consider [fast-syncing](/operator/guides/fast-sync) for a quicker method.

## Enable http

If you want to serve archive data to the outside world, your node needs to enable the http capabilities. This can be done by adding

```toml
# rusk.toml
[http]
listen = true
listen_address = '0.0.0.0:8080'
```

To your rusk.toml file in your system's `/opt/dusk/conf` folder. That's it.

Now you can query the archive for data with an external client application.

## Test archive endpoint

You can check which GraphQL queries are available by retrieving the schema (SDL). On RUES, an empty body returns the schema:
```bash
curl -s -X POST "http://<your-node-host>:8080/on/graphql/query"
```

This should now return a different list than a normal node returns. An example endpoint that is now available is the **checkBlock** endpoint, which returns true or false whether a block height matches a specific block hash, which can also be queried only for finalized blocks.

In order to test this endpoint, you can run the following command.

```bash
curl -s -X POST "http://<your-node-host>:8080/on/graphql/query" \
  --data-raw '{ block(height: 1) { header { hash } } }' | jq .
```

Then use the returned block hash with `checkBlock`:

```bash
curl -s -X POST "http://<your-node-host>:8080/on/graphql/query" \
  --data-raw 'query { checkBlock(height: 1, hash: "<block_hash>", onlyFinalized: true) }' | jq .
```

On a non-archive node, `onlyFinalized: true` returns an error.

## Stake with archive node

It is possible to stake and participate in consensus while the archive node is running. This is usually not recommended, but is possible since the archive is built on top of a normal provisioner node and therefore has all the capabilities to do so.

You can read the [node wallet guide](/operator/guides/node-wallet-setup) for a step-by-step instruction on setting up the wallet, depending on if you want the archive node to participate in consensus too or not.
