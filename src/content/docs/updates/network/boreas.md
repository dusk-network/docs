---
title: Boreas
sidebar:
  hidden: true
description: Activation details, transaction and execution changes, compatibility rules, and operator impact for the Dusk Boreas hard fork.
---

[← Network Updates](/updates/network/)

Boreas had the broader scope of Dusk's two major 2026 protocol upgrades. Delivered by the Rusk 1.7 release line, it changed transaction representation, execution policy, state-transition ordering, event semantics, and node operations. Aegis was the earlier, more concentrated cryptographic and protocol-security upgrade. Boreas first activated on testnet and later became the protocol boundary used for the coordinated mainnet restart.

## Activation

| Network | Activation time (UTC) | Activation height | Required Rusk | Release line |
| --- | --- | ---: | --- | --- |
| Testnet | May 27, 2026, 13:03 | 3,378,000 | Boreas-capable 1.7 RC | [Rusk 1.7.0](https://github.com/dusk-network/rusk/releases/tag/dusk-rusk-1.7.0) |
| Mainnet | June 10, 2026 deployment | 4,414,095 | 1.7.0 | [Rusk 1.7.0](https://github.com/dusk-network/rusk/releases/tag/dusk-rusk-1.7.0) |

Testnet reached its configured activation block before the final 1.7.0 release. Mainnet resumed from block `4_414_095` during the coordinated June 10 deployment. Because that restart reused an existing chain snapshot, its first block retained a June 6 header timestamp; June 10 is the date the Boreas rules actually went live on mainnet.

The Phoenix admission pause followed a separate testnet schedule:

| Network | Activation time (UTC) | Height | Behavior |
| --- | --- | ---: | --- |
| Mainnet | June 10, 2026 deployment | 4,414,095 | Admission of new Phoenix transactions paused with the Boreas restart |
| Testnet | August 7, 2026, 12:54 | 4,000,000 | Admission of new Phoenix transactions paused after the Boreas trial period |

## Protocol Changes at the Fork

### Canonical and versioned transactions

Boreas introduced explicit boundaries between transactions accepted from clients, their canonical in-memory representation, and the ledger format committed into blocks. Rusk now:

- decodes live ingress according to the active protocol version;
- accepts legacy Aegis envelopes at the network boundary and normalizes them;
- canonicalizes locally sealed transactions before committing them; and
- retains the historical decoders needed to replay pre-Aegis and pre-Boreas blocks.

This prevents the mempool, block producer, consensus validation, and historical replay paths from interpreting the same bytes under different transaction rules.

### VM execution and gas accounting

Boreas changed consensus-critical execution policy in several places:

- deployment gas checks and initialization charging became fork-aware;
- SHA-256, KZG verification, secp256k1 recovery, and Keccak host queries use the network's configured activation and pricing rules;
- hash-query gas is charged from the amount of input processed;
- VM cache keys include the active hard-fork and verifier semantics; and
- reference-type deployment validation is selected from the historical feature timeline.

The gates preserve the old behavior for replay while making post-Boreas gas accounting deterministic across nodes.

### State-transition ordering

After Boreas, slashes are applied before transaction execution. This closes a same-block ordering case in which stake could otherwise be changed before the pending slash was applied. Pre-Boreas blocks retain their original ordering during replay.

### Reverted-event semantics

Boreas made reverted contract events explicit across execution, block headers, archive storage, and provisioner updates:

- reverted events are retained with a `reverted` marker for archive consumers;
- they are removed from the canonical block bloom after Boreas; and
- reverted stake events are excluded from the provisioner's state updates.

Historical event decoding remains supported so existing archives and old blocks can still be read.

### Phoenix temporary pause

Mainnet paused admission of new Phoenix transactions at the restart boundary. Nodes still keep Phoenix decoding, state, and historical execution support because Phoenix remains part of the protocol and old blocks must remain replayable. Testnet kept new Phoenix transactions available beyond its Boreas activation and applied the pause later at block `4_000_000`.

The pause applies at transaction admission and execution boundaries. It does not erase historical Phoenix state or remove the code required to synchronize the chain. Phoenix is not retired and is intended to reopen in a follow-up upgrade.

## Node and API Changes in Rusk 1.7.0

The release also shipped operational changes that were not all direct fork-height rules:

- full ledger headers became the source of truth for VM session commit, finalization, revert, and provisioner queries;
- startup recovers the current tip header from the chain database;
- future-nonce Moonlight transactions can be queued during HTTP propagation;
- mempool replacement requires an improving gas price;
- HTTP ingress gained ACL and endpoint-class rate and concurrency limits;
- wallet and wallet-core gained Boreas-compatible transaction, deployment, and history handling; and
- the compatibility replay suite began exercising filled state and transactions across the Aegis and Boreas boundaries.

## Operator and Developer Impact

Operators had to upgrade before the activation applicable to their network. Mainnet's change was a coordinated restart rather than an ordinary future-height transition.

Clients may continue to submit supported Aegis transaction envelopes because Rusk normalizes them at live ingress, but blocks use the active canonical ledger format. New Phoenix transactions are rejected while the temporary network-specific pause remains active; Moonlight remains available for new public transactions. Archive and indexer consumers should use the reverted marker rather than assuming every stored event contributed to canonical state.

For current node maintenance procedures, see [Upgrade a Node](/operator/guides/upgrade-node/).

## Canonical Sources

- [Rusk 1.7.0 release](https://github.com/dusk-network/rusk/releases/tag/dusk-rusk-1.7.0)
- [Rusk 1.7.0 changelog](https://github.com/dusk-network/rusk/blob/dusk-rusk-1.7.0/rusk/CHANGELOG.md#170---2026-06-10)
- [Mainnet and testnet Boreas activation configuration](https://github.com/dusk-network/rusk/blob/dusk-rusk-1.7.0/rusk/src/lib/node/vm/config/known.rs)
- [Fork-coupled execution policy](https://github.com/dusk-network/rusk/blob/dusk-rusk-1.7.0/rusk/src/lib/node/fork_policy.rs)
- [Canonical and ledger transaction types](https://github.com/dusk-network/rusk/blob/dusk-rusk-1.7.0/node-data/src/ledger/transaction.rs)

[← Back to Network Updates](/updates/network/)
