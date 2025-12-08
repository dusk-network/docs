---
title: Install Rusk from source
description: Learn how to install and configure a Dusk node.
---

:::note[Node Installer]
This page here is for advanced users looking for additional information or custom setups.

It is advised to use the Node installer to [quickly launch your node on Dusk](/operator/provisioner).

The node installer setups rusk.toml file for you but for advance users this tutorial will tell you how to setup that file
:::

<a href="https://github.com/dusk-network/rusk" target="_blank">Rusk</a> contains the software needed to run a Dusk node. Users can set specific compilation flags to configure their node for different roles, allowing it to perform tasks like participating in consensus, validating transactions, and storing historical data.

Rusk supports different feature setups:
- Provisioner: to stake and participates in consensus.
- Archive node: to store and serve historical data.
- Prover: to compute Zero-Knowledge Proofs.

The node software has been tested on x86-64/AMD64 and ARM architectures. The above node types have different hardware requirements, which can be found on their respective pages.

To install Rusk, you can either:
- Use the node installer (recommended)
- Build from source
- Use docker (not recommended for production environment)

## Requirements

This page is tailored for Linux servers, if you are using another operating system you may encounter compatibility issues.

## Build from source

The majority of Dusk software is written in Rust. To compile our code, we will first need to make sure it's installed. Refer to <a href="https://rustup.rs/" target="_blank">Rustup</a> on how to install Rust.

**Other Software Requirements**: To follow the next steps, you need to have the following software installed:: `curl`, `zip`, `libssl-dev`, `rustc`, `clang`, `gcc` and `git`. These will be installed by the dev-setup script which is shown below

First to compile and run the Dusk node from source, run the following commands

Clone the Rusk repository. Make sure you modify the command to suit the branch you want to get. The command below will not necessarily fetch a branch compatible with the latest network release and specifications.

Make sure you follow these commands in sequence.

```bash
git clone https://github.com/dusk-network/rusk.git
cd rusk
```

Run the setup script in the scripts folder of rusk, which can take care of dependencies.

```bash
bash scripts/dev-setup.sh
```

Generate the keys used by the circuits:

```bash
make keys
```

Compile all the genesis contracts:

```bash
make wasm
```

:::note[Generating genesis contracts]
The duskc compiler, required for compiling contracts, might not be available for your target system. If you encounter an error while running make wasm, you can work around this limitation by running `make wasm` on a supported system. Once the process completes, copy the `target/release/dusk` folder from the supported system into the target folder on your unsupported machine. This serves as a temporary solution to bypass the duskc compiler requirement.
:::

Then we compile the rusk binary, depending on the type of node you want, you will have to run a different command:

As provisioner

```bash
cargo b --release -p dusk-rusk
```

Or as archival

```bash
cargo b --release --features archive -p dusk-rusk
```

Or as prover only

```bash
cargo b --release --no-default-features --features prover -p dusk-rusk
```

After you compile your binary follow the setup below to complete the setup of your node

### Setting up your node

After compiling we need to setup some configuration file and state for the particular network you are running the node for, for this example we'll configure the node to run on dusk mainnet.

Now before building the node we need the following:

1. The location of the rusk.toml configuration file
2. The location of the database path
3. `DUSK_CONSENSUS_KEYS_PASS` which is the password for your consensus keys
4. Base state of the mainnet
5. `RUSK_STATE_PATH` path of our state

Let start by creating a `~/.dusk/rusk` at your home directory. This is where we'll setup our node:

```
mkdir /Users/username/.dusk/rusk
cd /Users/username/.dusk/rusk
```

:::note[Default `RUSK_PROFILE_PATH`]
The default location if the `RUSK_PROFILE_PATH` is not set is `$HOME/.dusk/rusk` but for this tutorial we explicitly create it anyways
:::

We're now in our profile folder. Then we'll copy the rusk binary we compiled into this folder

```
cp rusk/target/release/rusk /Users/username/.dusk/rusk/
```

We'll create a `genesis.toml` file to specify our base state URL
this URL below is for **mainnet**

```
cat > ~/.dusk/rusk/genesis.toml <<EOF
base_state = "https://nodes.dusk.network/genesis-state"
EOF
```

We'll generate our state using our rusk binary we moved, make sure you add the `--force` flag to override any existing state

We place our state in the `mainnet_state` folder to keep it seperate

```
RUSK_STATE_PATH=/Users/username/.dusk/mainnet_state ./rusk recovery state --init $HOME/.dusk/rusk/genesis.toml
```

Lastly, we'll setup our `rusk.toml` file. In the toml file we'll mention the consensus.keys file location and other parameters

The node installer sets up the rusk.toml file for you. An example for the file is [located here in the node installer](https://github.com/dusk-network/node-installer/blob/main/conf/rusk.toml)

We will copy that and add some entires which the node installer adds for you

We'll set up the file for **mainnet**

:::note[rusk.toml]

This file will have different bootstrapping nodes and kadcast id for different network. Also make sure the paths in the file system are absolute
:::

```toml

[chain]
db_path = '/Users/username/.dusk/rusk/'
consensus_keys_path = '/Users/username/.dusk/rusk/consensus.keys'
genesis_timestamp='2025-01-07T12:00:00Z'

...

[kadcast]
kadcast_id = 0x1
bootstrapping_nodes = ['165.232.91.113:9000', '64.226.105.70:9000', '137.184.232.115:9000']
public_address = <public_ip>
listen_address = <loopback_listen_addr>

...
```


To determine your public and listen address you can run this script used by the node installer https://github.com/dusk-network/node-installer/blob/main/bin/detect_ips.sh

Now we just need `DUSK_CONSENSUS_KEYS_PASS` set:

```
export DUSK_CONSENSUS_KEYS_PASS="password"
```

After this we should be good, we run our node using the following command, make sure to specify your state URL

```
RUSK_STATE_PATH=/Users/username/.dusk/mainnet_state ./rusk --config ./rusk.toml
```

You should see the following in the terminal

```
2025-01-15T17:19:59.791200Z  WARN node: wait_for_alive_nodes
2025-01-15T17:20:00.792778Z  WARN node: wait_for_alive_nodes
2025-01-15T17:20:00.792777Z  WARN node: wait_for_alive_nodes
2025-01-15T17:20:00.792815Z  WARN node::network: event="Not enought alive peers to send msg, increased" topic=GetMempool requested=5 current=0 increased=0
2025-01-15T17:20:00.792815Z  WARN node::network: event="Not enought alive peers to send msg, increased" topic=GetBlocks requested=16 current=0 increased=0
...
```

This means you probably haven't port forwarded yet, checkout below on how to do that

:::note[No such base commit error]
When you get the following `VM Error: No such base commit error` try regenerating your state, if it still persists, make sure the path in the `rusk.toml` file is correct, follow all the steps above correctly to mitigate this error
:::

#### Networking

As Dusk uses an ultra-efficient P2P <a href="https://en.wikipedia.org/wiki/User_Datagram_Protocol" target="_blank">UDP</a> network protocol called <a href="https://github.com/dusk-network/kadcast/blob/main/README.md" target="_blank">Kadcast</a>, the network requirements are minimal but should maintain symmetrical, stable, low-latency connections.

For external network connectivity, ensure that your firewall and router's ports are forwarded correctly:

- **9000/udp**: Required for Kadcast consensus messages.
- **8080/tcp**: Optional HTTPS API for querying the node.

:::note[Note]
The ports are configurable either as option to the node binary or by setting them in the configuration files. The node installer automatically configures the necessary ports.
:::

## Troubleshooting Tips

* **Installation Issues**: Ensure your operating system is up-to-date, you have adequate permissions and all the necessary prerequisite software is installed.
* **Network Errors**: Check your internet connection and verify UDP ports are open if connecting to an external network.
