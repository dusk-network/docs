---
title: Wallet setup
description: Learn how to setup your Dusk wallet for staking and node running.
---

:::note[Node Installer]
This guide assumes that you have already installed Rusk using the node-installer.

You can use the node installer guide to [quickly launch your Provisioner node](/operator/guides/provisioner-node).
:::

This guide explains setting up the wallet and the last steps needed to start running your node.

## Preparation

### Obtain a mnemonic

Before setting up your node wallet, you’ll need a mnemonic. You can obtain one using any of the following methods:

- **Using the CLI wallet ([rusk-wallet](https://github.com/dusk-network/rusk/blob/master/rusk-wallet/src/bin/README.md))**, either directly on your node or locally on your machine. You can download Rusk Wallet from the [Rusk releases page](https://github.com/dusk-network/rusk/releases?q=rusk+wallet&expanded=true).
- **Using the [Web Wallet](https://apps.dusk.network/wallet/setup/)** if you would rather use a web app to access your wallet on your main device.

**Important:** Back up your mnemonic phrase securely and never share it. Anyone with access to this phrase can control your wallet and funds.

If you generate your wallet directly on the node using `rusk-wallet`, no restore is necessary, the wallet is already in place.

If you created your wallet elsewhere (e.g. via the Web Wallet or on your local machine), you’ll need to restore it on your node using the generated mnemonic.

### Restore Wallet (if created externally)

If you already have a mnemonic it is time to set your wallet up on the node.

Once you have access to a Dusk mnemonic, run the following command:

```sh
rusk-wallet restore
```

If your node isn't running yet, `rusk-wallet` may show a message like `some operations won't be available`. This is expected; the wallet can still be restored successfully.

You will be asked to provide your recovery phrase/mnemonic, **in lowercase**, and to enter a password for the wallet.

#### Export consensus key

Once you've done so, run the following command to export a **consensus key** for the given wallet:

```sh
rusk-wallet export -d /opt/dusk/conf -n consensus.keys
```

To participate in consensus, Rusk needs your consensus keys. These keys are used to sign and vote for blocks. You will be asked to set an encryption password for the consensus key, make sure to remember it.

Now, run the following script and provide the **same password** (for consensus key) from before. This will set the password as an environment variable for Rusk to use.

```sh
sh /opt/dusk/bin/setup_consensus_pwd.sh
```

#### Start your node

We recommend using [fast-syncing](/operator/guides/fast-sync) to bring your node up to date quickly. It significantly reduces the time required to become consensus-ready.

If you prefer to sync from genesis (e.g., for auditing or archival purposes), do **not** use fast-syncing.

Start your node with:
```sh
service rusk start
```

Once the node is running, check its sync progress by running:

```sh
ruskquery block-height
```

Compare your node's block height to the [block explorer](https://explorer.dusk.network/) to confirm if it's catching up.

## Testnet Faucet

You can request 5000 nDUSK from our [Discord faucet](/operator/guides/nocturne-faucet). The minimum stake is 1000 nDUSK.

## Stake your DUSK

The final step is staking. To allow your node to participate in consensus and earn rewards, your wallet must stake at least 1000 DUSK.

Initiate staking with:

```sh
rusk-wallet stake --amt 1000 # Replace with your desired amount
```

After the stake transaction, verify that your stake status is updated:

```sh
rusk-wallet stake-info
```

Check for the `eligible stake` and `stake active from block` fields to be updated.

**Note**: Your stake takes 2 epochs (4320 blocks) to mature. Only after that will it start participating in consensus.

You can periodically run `rusk-wallet stake-info` to monitor if your accumulated rewards are increasing, which is a clear indicator that your node is successfully participating in consensus.
