---
title: Choose a Network
description:  Explore the scope of different Dusk’s environments, including testnet and mainnet.
---

Dusk offers multiple network environments to support different stages of development, testing, and live usage. Each network serves a unique purpose, allowing developers, testers, and users to interact with the Dusk network under various conditions.


# Network Overview

The available networks include:

| Network             | Chain ID | Genesis File(s)              | Public Endpoints                       | Availability   | Blockexplorer |
|---------------------|----------|-------------------------------|----------------------------------------|----------------|----------------|
| **[Mainnet](/operator/networks#mainnet)**         | 1        | [Genesis](https://github.com/dusk-network/node-installer/blob/af115a7e4e05099c306bd16221fd4cf2de474e89/conf/mainnet.genesis) | [https://nodes.dusk.network](https://nodes.dusk.network)           | Public         | [Explorer](https://apps.dusk.network/explorer/) |
| **[Nocturne Testnet](/operator/networks#nocturne-testnet)**| 2        | [Genesis](https://github.com/dusk-network/node-installer/blob/af115a7e4e05099c306bd16221fd4cf2de474e89/conf/testnet.genesis) | [https://nodes.testnet.dusk.network](https://nodes.testnet.dusk.network)   | Public         | [Explorer](https://apps.testnet.dusk.network/explorer/) |
| **[Lunare Devnet](/operator/networks#lunare-devnet)**   | 3     | Internal Only                | Internal Only                          | Internal only  | N/A            |

---

You can find instructons on how to run a node in the [Provisioner Node Guide](/operator/provisioner).

## Mainnet

The Dusk Mainnet is the live, production-ready network, where real assets are transacted and all functionalities are accessible to end-users, businesses, and institutions. It supports secure, compliant, and privacy-preserving transactions through Dusk’s zero-knowledge technology and forms the foundation for a **Decentralized Market Infrastructure** (DeMI).

Use cases and features include:

- Regulated asset settlement through privacy-preserving and compliant smart contracts.
- [Native issuance](/learn/tokenization-comparison) of digital securities such as equity, debt, and structured products.
- Support for post-trade infrastructure, with Dusk acting as a compliant CSD under the DLT-TSS license.
- Enforcement of access and identity controls, including allowlists and decentralized identity systems.
- Advanced governance features, including forced transfers, shareholder registries, and on-chain voting mechanisms.


## Nocturne Testnet
The Nocturne Testnet provides a realistic, risk-free environment for developers and community members to experiment with Dusk’s features. Nocturne serves as the primary testing network, where new functionalities are deployed, validated, and stress-tested before being introduced to the Mainnet. This environment supports developers in refining their smart contracts, applications, and node setups without risk to real assets.

Some of the functions for the Nocturne Testnet are:

- Testing new protocol updates, security measures, and feature releases.
- Enabling developers to deploy and test smart contracts.
- Supporting community-run nodes for stress-testing and performance assessments.


## Lunare Devnet

The Lunare Devnet is an experimental sandbox environment for internal development and initial testing of Dusk’s newest features. Lunare enables Dusk’s engineering team to iterate quickly on early-stage functionalities, benchmark them, and troubleshoot issues in a controlled setting. While Lunare offers a flexible testing ground, it is reserved for internal use and is not open to the general public.

Some of the functions for the Lunare Devnet are:

- Benchmarking new features and assessing their performance before launching them on Nocturne Testnet.
- Iterating on early-stage features without impacting public nodes.
- Testing edge cases and improvements in a controlled environment.

:::note
The Lunare Devnet can only be accessed by Dusk's engineering teams, as it is frequently reset and used primarily for quickly iterating on testing unstable, early-stage features.
:::
