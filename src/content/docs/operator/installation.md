---
title: Install Rusk
description: Learn how to install and configure a Dusk node.
---

:::note[Node Installer]
Use the Node installer to [quickly launch your node on Dusk mainnet](/operator/guides/mainnet-node) or [testnet](/operator/guides/nocturne-node)
:::

<a href="https://github.com/dusk-network/rusk" target="_blank">Rusk</a> contains the software needed to run a Dusk node. Users can set specific compilation flags to configure their node for different roles, allowing it to perform tasks like participating in consensus, validating transactions, and storing historical data.

Rusk supports different feature setups:
- [Provisioner](/operator/provisioner) : to stake and participates in consensus.
- [Archive node](/operator/archive-node) : to store and serve historical data.
- [Prover](/operator/prover) : to compute [Zero-Knowledge Proofs](/learn/deep-dive/cryptography/zkp).

The node software has been tested on x86-64/AMD64 and ARM architectures. The above node types have different hardware requirements, which can be found on their respective pages.

To install Rusk, you can either:
- Use the node installer (recommended)
- Build from source
- Use docker (not recommended for production environment)

## Requirements

This page is tailored for Linux servers, if you are using another operating system you may encounter compatibility issues.

## Node Installer

If you want to spin up a Provisioner node on the Nocturne testnet, you can use the <a href="https://github.com/dusk-network/node-installer" target="_blank">node installer</a> script. This installer will set up Rusk as a service, preconfigure parts of the node, and provide a couple of helper scripts.

You can install Rusk by pasting the following command in your terminal:
```sh
curl --proto '=https' --tlsv1.2 -sSfL https://github.com/dusk-network/node-installer/releases/latest/download/node-installer.sh | sudo bash
```

:::note[UFW and other configurations]
The script may enable <a href="https://help.ubuntu.com/community/UFW" target="_blank">ufw</a>  and apply other configurations to your system. If you want to avoid this, you can disable ufw or build from source.
:::

## Build from source

If your goal is to build from source, the section below outlines all the steps and requirements.

### 1. Install the Rust Programming Language

The majority of Dusk software is written in Rust. To compile our code, we will first need to make sure it's installed.

Refer to <a href="https://rustup.rs/" target="_blank">Rustup</a> on how to install Rust.

### 2. Compiling the Dusk node

#### 2.1 Download Node Software

Clone the Rusk repository:
```bash
git clone https://github.com/dusk-network/rusk.git
cd rusk
```
To compile and run the Dusk node from source, launch the commands in sequence.

**Software Prerequisites**: You'll need the following software installed to follow this guide: `curl`, `zip`, `libssl-dev`, `rustc`, `clang`, `gcc` and `git`.

Run the setup script in the scripts folder of rusk that can take care of dependencies.

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
Build the node:
```bash
cargo b --release -p rusk
```


Once your node is installed, you can either run a [Provisioner](/operator/provisioner), an [archive node](/operator/archive-node) or a [Prover](/operator/prover).

If you want to run a local cluster instead, you can follow the instructions below.

#### 2.2 Networking

Ensure that your device can download files and communicate with other nodes.

As Dusk uses the ultra-efficient P2P <a href="https://en.wikipedia.org/wiki/User_Datagram_Protocol" target="_blank">UDP</a> network protocol <a href="https://github.com/dusk-network/kadcast/blob/main/README.md" target="_blank">Kadcast</a>, the network requirements are minimal but should maintain symmetrical, stable, low-latency connections.

For external network connectivity, ensure that your firewall and router's ports are forwarded correctly:

- **9000/udp**: Required for Kadcast consensus messages.
- **8080/tcp**: Optional HTTPS API for querying the node.

:::note[Note]
The ports are configurable either as option to the node binary or by setting them in the configuration files. The node installer automatically configures the necessary ports.
:::

## Docker Installation

This guide will take you through the process using Docker, for running a local Dusk node.

Docker packages applications into containers that include all dependencies, ensuring a consistent runtime environment. This ensures that software always runs consistently, regardless of where it is installed.

:::note[Notice]
The following guide is intended to help you set up a local node for testing and development purposes only. It is not recommended for production use, as there is no guide or explanation for running a production node within Docker. Docker is used here to facilitate convenient local testing and to provide developers with a dedicated node for API testing.
:::


### Prerequisites

1. 🐳 **Docker**: If you don't have Docker installed, please follow the [official guide](https://docs.docker.com/desktop/)
2. 🛜 **Internet Connection**: Required to download the Docker image and necessary files.
3. 🛠️ **Git**: Optional, but recommended. Useful for retrieving the node code. Git can be downloaded <a href="https://git-scm.com/downloads" target="_blank">here</a>
4. 💻 **Terminal**: To execute the steps in the Step-By-Step below, you will need to use a terminal application.
5. 🎛️ **x86-AMD64**: To create the Docker Image, a processor with the x86-AMD64 architecture is required.

:::tip[Using DockerHub]
If you want to quickstart using a prebuilt docker image, run the following command:
```sh
docker run -p 9000:9000/udp -p 8080:8080/tcp dusknetwork/node
```
:::

### Step-by-Step Instructions

#### 1. Get the Dusk node files

There are two way to get the software, cloning the <a href="https://github.com/dusk-network/rusk.git" target="_blank">repository</a> using git, or [simply downloading from github](https://github.com/dusk-network/rusk)

```sh
git clone https://github.com/dusk-network/rusk.git
```

#### 2. Build Docker Image

With Docker installed and the repository files obtained, let's build the Docker image. Note that this can take 15 to 20 minutes.

The most up to date commands can be found in the [readme of the repository](https://github.com/dusk-network/rusk?tab=readme-ov-file#-docker-support)

## Troubleshooting Tips

* **Installation Issues**: Ensure your operating system is up-to-date, you have adequate permissions and all the necessary prerequisite software is installed.
* **Network Errors**: Check your internet connection and verify UDP ports are open if connecting to an external network.
