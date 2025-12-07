---
title: Glossary
description: A detailed glossary of terms specific to Dusk and general definitions.
---

## Dusk terminology

#### Account

Accounts in Dusk manage transactions with different visibility levels. An account is linked to a profile and categorized as either a [Shielded Account](#shielded-account) for privacy-preserving transactions or a [Public Account](#public-account) for transparent transactions. Each account type has its own unique address format.

#### Archive Node

An [Archive node](/operator/archive-node) is a Dusk node that preserves a complete historical record of the Dusk blockchain, and does not participate in consensus.

#### Citadel

[Citadel](/developer/digital-identity/protocol) is a self-sovereign identity system that is part of the Dusk protocol.

#### Confidential Security Contract Standard (XSC)

A standardized framework for confidential smart contracts, which any company or organization can customize according to business-specific requirements (e.g., complying with data privacy and financial regulations).

#### DUSK

The native cryptocurrency of Dusk. It is used to pay for transaction fees and staking.

#### Dusk EVM

[Dusk EVM](/learn/deep-dive/dusk-evm) is a EVM execution environment, that uses DuskDS as settlement and data availability layer.

#### Dusk VM

[Dusk VM](/learn/deep-dive/dusk-vm) is general purpose virtual machine developed by Dusk that runs WASM smart contracts and manages their memory.

#### Hedger
Hedger is the evolution of Zedger, built on DuskEVM and powered by fully homomorphic encryption for enhanced privacy.

#### Hyperstaking

Hyperstaking is a feature that allows smart contracts to manage stakes with custom logic. Similar to "Account Abstraction," it enables use cases like privacy-preserving staking, affiliate programs, delegation, liquid staking, and yield boosting. Staking operations are initiated via a provisioner key, with signature verification only required for the initial stake, offering flexibility and innovation in staking models.

#### Kadcast

[Kadcast](/learn/core-components#network-layer-kadcast) is a structured information propagation protocol used by Dusk, characterized by a direct correlation between network performance, latency, and the number of nodes.

#### LUX

The smallest denomination of DUSK. 10^9 LUX = 1 DUSK, 1 DUSK = 1,000,000,000 LUX.

#### Moonlight

[Moonlight](/learn/deep-dive/duskds-tx-models) is an account-based transaction model on Dusk that tracks balances for accounts and contracts, offering full transparency. It is faster and cheaper than Phoenix, making it easier for developers to integrate with external protocols.

#### Phoenix

[Phoenix](/learn/deep-dive/duskds-tx-models) is a UTXO-based, privacy-preserving transaction model on Dusk used for transferring DUSK. It enables users to spend "notes" privately using zero-knowledge proofs without linking balances to addresses.

#### Public Account

A public account is based on the [Moonlight](#moonlight) account-based transaction model and is used for transparent, public transactions. It uses public addresses to provide full transparency.

#### Shielded Account

A shielded account is based on the [Phoenix](#phoenix) UTXO transaction model and is designed for privacy-preserving transactions. It utilizes shielded addresses for confidentiality while supporting regulatory compliance by making the sender known to the receiver.

#### Profile

A [profile](/learn/wallet-terminology#profile-and-accounts) is a pairing of a Public Account [Moonlight](#moonlight) and a Shielded Account ([Phoenix](#phoenix) derived from a single mnemonic. Profiles are created in pairs to allow for both public and privacy-preserving transactions.

#### RUES

The Rusk Universal Event System (RUES) is an integral part of the architecture of Dusk, providing an events system that allows real-time communication and event subscriptions.

#### Rusk

[Rusk](/learn/core-components#rusk) is the official Dusk platform's Rust reference implementation.

#### Rusk Wallet

The official CLI wallet for Dusk, enabling users to manage DUSK, interact with the blockchain and execute transactions via a command-line interface.

#### Succinct Attestation

[Succinct Attestation](/learn/deep-dive/succinct-attestation) is a unique Proof-of-Stake consensus algorithm developed by Dusk which allows network participants to compete for block producer rights.

#### W3sper SDK

[W3sper](/developer/integrations/w3sper) is a JavaScript library for communication within the Dusk ecosystem, enabling developers to integrate Dusk dApps into (web) applications.

#### Web Wallet

The [Web Wallet](https://apps.dusk.network/wallet/) is the official web-based wallet for Dusk, providing users with an accessible way to manage DUSK and interact with the blockchain through a user-friendly interface.

#### Zedger

[Zedger](/learn/core-components#zedger--hedger) is a Dusk-based protocol combining UTXO and account models for the private, compliant management of securities. Zedger allows issuers to digitally represent, issue, and trade securities like stocks and bonds while ensuring regulatory compliance.

## Definitions

#### Account

In an account-based blockchain, a combination of a private key and a public key where a user's funds are stored as a balance.

#### Account-Based Transaction Model

A protocol that represents assets as balances within personal accounts, similar to bank accounts.

#### Address

A unique blockchain identifier derived from an account’s public key.

#### Application Program Interface (API)

Software code that enables communication between different systems via request-response messages. It enables tasks like requesting user balances, listening to on-chain events and more.

#### Archive node

A type of full node in blockchain networks that stores the entire history of the blockchain, including all past states, transactions, and emitted events since the genesis block. Archive nodes enable deep historical data retrieval, supporting use cases like blockchain explorers, audits, and regulatory compliance.

#### Asset Token

A category of tokens that represent a “real world” asset or product — such as a commodity (e.g., gold) or currency (e.g., US dollar) — as opposed to utility tokens, which provide network-specific functions.

#### Balance

The assets owned by an account in an account-based transaction model, available for exchange or spending.

#### Bandwidth

The maximum amount of data that can be transmitted across a path in a fixed period of time.

#### BLS Digital Signature

A digital signature that uses elliptic curves to encrypt the public key and private key of the parties involved in order to permit people to sign transactions on the blockchain without revealing any data.

#### Block

Files in which data of the network is permanently recorded. A block permanently stores records of transactions which, once written, cannot be altered or removed. Every time a block is completed, a new block is formed in the blockchain.

#### Block Explorer

A web tool for searching blockchain information, such as block creation dates, sizes, gas fees, and transaction details.

#### Block Header

Metadata in each block summarizing its content, including the previous block's hash, blockheight, timestamp and nonce.

#### Block Height

The number of blocks preceding a given block, starting from the genesis block, which has a height of zero.

#### Block Generator

A provisioner elected by the network to produce a new block in exchange for a reward in DUSK.

#### Block Reward

An amount of tokens awarded by the network to eligible stakers for each block they create successfully or vote cast when eligible to do so.

#### Block Time

The duration it takes to create a new block in the blockchain.

#### Brute Force Attack (BFA)

A method where hackers attempt to guess a private key through repeated attempts until successful.

#### Coinbase

A reward mechanism that mints new tokens for validators, incentivizing them to secure the network, especially during its early stages.

#### Confidential Smart Contract

A smart contract which permits the creation of confidential or private transactions.

#### Confirmation

The process by which validators verify and accept blocks on the blockchain, adding them to the chain.

#### Consensus

A process where the majority of validators agree on the current state of the blockchain.

#### Cryptographic Hash Function

A special class of hash function that has certain properties in order to make it secure and ideal for cryptographic purposes, including the following: (i) it is deterministic, meaning it always produces the same result; (ii) it is fast, meaning it returns the hash of an input very quickly; (iii) it is pre-image resistant, meaning it is virtually impossible to determine the original input data from its hash value; and (iv) even a small change in the input data would result in a massive change to the hash value.

#### Decentralized

A system where functions and authority are distributed among peers rather than concentrated in a central entity.

#### Decentralized Application

A digital program running on a decentralized network, utilizing smart contracts to interact with the blockchain and enforce agreements.

#### DeMI
The term Decentralized Market Infrastructure (DeMI) refers to leveraging Distributed Ledger Technologies (DLTs) to create a protocol-based Financial Market Infrastructure, as opposed to traditional platform-based systems like Central Securities Depositories (CSDs). DeMI enhances the efficiency and reduces the costs of regulated financial markets.

#### Devnet

An experimental network used by blockchain developers and users, where tokens have no real monetary value.

#### Digital Signature

A tool used to sign transactions on the blockchain that verifies the identity of the signer or sender. Each signer uses a private key to produce a unique ‘digital signature’ that can only be decrypted by the signer’s public key — which the signer shares with the receiver.

#### Double Spend (Attack)

An attack on the network in which a person attempts to spend the same tokens multiple times.

#### Elliptic Curve Cryptography

Cryptographic methods that use an elliptic curve to encrypt data. An example of elliptic curve cryptography is the BLS digital signature.

#### Elliptic Curve

A mathematical function whereby any point on the curve can be mirrored over the x-axis and the curve remains the same.

#### Epoch

A specific period of time used to mark specific events within the network, such as the creation and addition of new blocks to the blockchain.

#### Faucet

A reward system in the form of a website or app that distributes tokens in exchange for the completion of certain tasks.

#### Fault Tolerance

The capacity of the network to operate as intended even if certain components fail.

#### Finality

A metric to measure the amount of time (required to finalize N new blocks) a person must wait for a guarantee that the executed transaction will not be reversed or changed.

#### Fork

The event whereby a blockchain splits into two branches.

#### Fork Resistance

The impossibility of the blockchain to be forked as a consequence of same-block finality.

#### Gas

The fee charged to a user in order to run a smart contract on the blockchain.

#### Genesis Block

The first block of a blockchain, from which all subsequent blocks are built. It is unique and hardcoded into the protocol.

#### Genesis Contract

A smart contract that is made available on the start of the blockchain, and hardcoded into the genesis block.

#### Hash

The fixed-size output of a hash function used to index, retrieve or verify data more efficiently than the original input.

#### Hash Function

A function that can be used to reduce a string of data to a hash.

#### Incentive Mechanism

A method used to reward people for conducting certain activities within the network.

#### Incentivized Testnet (ITN)

A testnet whereby developers are rewarded to perform specific tasks that stress new code, features, or infrastructure components in order to test network performance and stability, as well as the behavior of validators.

#### Information Propagation Protocol (IPP)

A software protocol used to distribute information across a (P2P) network. Information propagation protocols can be (i) structured (e.g., Kadcast), meaning the network communicates transactions and new blocks according to a pre-defined mechanism, or (ii) unstructured (e.g., Gossip), meaning the network communicates transactions and new blocks in a random manner.

#### Latency

The time it takes for data to go from one node to another.

#### Mainnet

The primary blockchain network instance where transactions have real monetary value.

#### Mempool

A portmanteau of “memory” and “pool”. A mempool is a buffer between the creation of blocks. As a new block is created, new transactions are created, stored, and validated in the mempool before being propagated to the network.

#### Merkle Tree

A data structure that results from the repeated application of a hash function to blocks of data until there is a single hash representing the entire data set.

#### Markets in Crypto-Assets Regulation (MiCA)

A proposed regulation by the European Commission that could profoundly impact cryptocurrency activity in the EU. As drafted, it would impact any cryptocurrency not issued by a governmental entity and especially stablecoins.

#### Markets in Financial Instruments Directive (MiFID II)

An instituted legislative framework by the European Commission to regulate financial markets in the EU. It regulates virtually every asset and profession within the EU financial service industry.

#### Mnemonic

A series of words that derive all cryptographic keys for a wallet.

#### Node

A computer connected to the network that maintains a copy of the blockchain.

#### Note

In a UTXO model, a public object where assets are stored, requiring a private key to access and spend.

#### Permissioned

A network that uses a layer of access control to dictate the actions that may be taken by the node users of such blockchain.

#### Permissionless

A network where users can interact without needing permission from any central authority.

#### Peer

A user interacting with others within the network.

#### Peer to Peer (P2P)

The direct transfer of assets or data between individuals without intermediaries.

#### Peer to Peer (P2P) Protocol

A decentralized network model where users exchange resources directly without a centralized server.

#### PLONK

A widely-used zk-SNARK protocol that enables privacy-focused blockchain applications.

#### PLOOKup

A function combining PLONK and lookup tables to reduce costs of zk-SNARK operations.

#### PLONKup

An optimized implementation of PLONK that generates zero-knowledge proofs faster for certain use-cases without additional gas costs.

#### Poseidon

A fast, zero-knowledge friendly cryptographic hash function.

#### Prover

A prover is an entity that is responsible for generating zero-knowledge proofs. The proof is used to verify certain statements, without revealing the underlying data.

#### Provisioner

A network participant staking at least 1,000 DUSK who competes to join the provisioner committee.

#### Provisioner Committee

A group of provisioners tasked with selecting and proposing new blocks for the blockchain.

#### Consensus Key

A unique sequence of alphanumeric characters used by a node participating in consensus (such as a provisioner) to actively sign on-chain attestations and proposals of new blocks.

#### Private Key

A unique sequence of alphanumeric characters used to derive its associated public key.

#### Public Key

A unique identifier of alphanumeric characters that is used to sign data. A public key can also be used to verify digital signatures made with a private key.

#### Reference String

A string of data that ZK-SNARKs use to create zero-knowledge proof.

#### Regulated Finance (RegFi)

The centralized banking system whereby financial instruments are regulated by laws and FIAT currencies represent monetary value. Examples of regulated financial instruments are equity securities such as stocks, debt securities such as bonds, or derivative instruments such as futures and options contracts.

#### Regulated Decentralized Finance (RegDeFi)

A hybrid model combining RegFi and DeFi whereby people have access to regulated financial instruments in the form of security tokens on a decentralized or P2P network.

#### Reinforced Concrete

A zero-knowledge friendly hash function developed by Dusk designed to work with PLONKup for processing zero-knowledge operations.

#### Remote Procedure Call (RPC)

A communication protocol allowing a program to request services from another program on a different networked computer.

#### Same-Block Finality

The guarantee that a transaction, once executed, will never be reversed or altered within the same block.

#### Security

A financial instrument that is tradeable and holds monetary value. Examples of securities include equity stocks, bonds, and options.

#### Security Token

A token structured as a security, representing an underlying asset and potentially offering dividends, profit-sharing, or interest.

#### Self-Custody

When assets are held in custody by the owner, rather than by an intermediary such as a bank or exchange.

#### Settlement Finality

A feature of the succinct attestation consensus algorithm whereby completed transactions are final and irreversible immediately after being processed. With regards to regulatory compliance, settlement finality is a vital requirement for the issuance of security tokens.

#### Slashing

A form of punishment whereby staking funds of provisioners and block generators who aren't performing specific duties (e.g., being online) are partially or entirely removed from the stake.

#### Smart Contract

An immutable contract that follows pre-defined rules to self-execute agreed-upon obligations automatically and without the involvement of third parties.

#### Spent Transaction Output (UTXO)

Output or funds spent in a transaction that can no longer be used as input in a new transaction.

#### Staking

Earning rewards by locking tokens in a staking contract to help verify transactions and participate in the consensus mechanism.

#### (Global) State

Data representing the current condition of the blockchain, used to validate transactions (e.g., UTXOs, balances).

#### Sybil Attack

An attack where a single actor attempts to take over the network by using a large number of accounts, computers, or nodes.

#### Testnet

An environment for testing new code, features, or infrastructure, focusing on performance, stability, and validator behavior.

#### Tokenization

The process whereby traditional Assets (such as securities) are digitized into tradeable, blockchain-based tokens that represent whole or fractionalized ownership of the underlying asset.

#### Trusted Setup

The initial event where a reference string for ZK-SNARKs is created by trusted parties.

#### Trustless

A network where users can interact without needing to trust the counterparty.

#### Unspent Transaction Output (UTXO)

Output or leftover change from a transaction that can be used as input in a new transaction.

#### Utility Token

A token designed for consumer use on a platform, not intended as a security.

#### UTXO Transaction Model

An accounting system where assets are represented as spent or unspent transaction outputs stored in encrypted public notes.

#### Verifiable Computation

Outsourcing computational tasks to a third-party while ensuring the results are verifiable.

#### Verifier

The entity that checks and validates zero-knowledge proofs generated by a prover.

#### Virtual Machine (VM)

A simulated environment that executes smart contracts and performs computations on the blockchain.

#### Wallet

A software application that enables users to access and manage digital assets on the blockchain.

#### WASM

WebAssembly (WASM) is a binary instruction format that enables efficient and secure execution of smart contracts on the blockchain.

#### Zero-Knowledge Friendly Hash Function

A cryptographic hash function optimized to process the complex data types associated with zero-knowledge operations.

#### Zero-Knowledge Proof

A cryptographic method used to verify the validity of given data without revealing the contents of the data in question and to permit users to send confidential transactions within the network.

#### ZK-SNARKs

A subset of zero-knowledge proofs that (i) generate proof which is succinct or small and constant in size (kB), (ii) need a trusted setup, and (iii) use elliptic curve cryptography. An example of zk-SNARKs is Plonk.

#### ZK-STARK

A subset of zero-knowledge proofs that (i) generate a proof which is rather large and not-constant in size (kB), (ii) don’t require a trusted setup, and (iii) use hash functions with respect to cryptography.
