---
title: Aegis
sidebar:
  hidden: true
description: Activation details, protocol changes, security hardening, and operator impact for the Dusk Aegis hard fork.
---

[← Network Updates](/updates/network/)

Aegis was a coordinated cryptographic and protocol-security upgrade delivered in Rusk 1.6.0. It introduced new proof and signature verification rules while preserving the rules needed to replay blocks produced before the fork.

## Activation

| Network | Activation time (UTC) | Activation height | Required Rusk | Release |
| --- | --- | ---: | --- | --- |
| Testnet | March 3, 2026, 10:53 | 2,773,727 | 1.6.0 | [Rusk 1.6.0](https://github.com/dusk-network/rusk/releases/tag/dusk-rusk-1.6.0) |
| Mainnet | March 3, 2026, 11:06 | 3,590,904 | 1.6.0 | [Rusk 1.6.0](https://github.com/dusk-network/rusk/releases/tag/dusk-rusk-1.6.0) |

The heights are defined independently for each network. The dates and times are taken from the corresponding activation-block headers.

## Protocol Changes at the Fork

### PLONK V3 verification

Transactions at and after Aegis are verified using PLONK V3. Rusk selects the verifier from the block height: historical blocks continue to use their original PLONK V1 or V2 rules, while new proofs use V3.

This was a change to the consensus verification boundary, not only a dependency update. A node using the wrong verifier at the activation height would calculate different transaction validity from the network.

### Versioned BLS signatures

Aegis moved the network to the hardened V2 BLS behavior across:

- consensus quorum signing and verification;
- block-header and seed validation; and
- BLS host queries used by contracts.

The legacy BLS behavior remains available only for validating historical pre-Aegis data. The same block-height policy is shared by the consensus, node-data, Rusk, and virtual-machine layers so they cannot silently select different signature rules.

### Phoenix fee and refund binding

Aegis added a consensus check binding the Phoenix gas-refund stealth address to the change note proven by the transaction. This prevents a block producer or modified transaction envelope from redirecting a valid transaction's refund to another address. The existing maximum-fee check and the new refund-address check are both enforced without changing the validity of historical transactions.

## Hardening Shipped with Rusk 1.6.0

The required release also contained a wider security-hardening set. These changes shipped with the Aegis upgrade, but were not all activated by the Aegis block-height switch:

- validated RKYV decoding at wallet, node, archive, VM, and test boundaries;
- bounded decoding for transactions, blocks, inventory messages, spent-transaction errors, and Phoenix proof data;
- integer supermajority calculation and stricter consensus signer, ratification, and emergency-vote validation;
- transaction preverification before HTTP propagation;
- limits for HTTP bodies, WebSocket messages, and expensive GraphQL ranges; and
- safer handling of missing stake entries during slashing.

Keeping this distinction matters: the hard fork changed consensus behavior at an exact height, while the rest of Rusk 1.6.0 hardened how nodes receive, decode, and process data around that protocol.

## Operator and Developer Impact

Operators on both networks needed Rusk 1.6.0 before their respective activation heights. Earlier versions cannot validate the post-Aegis chain correctly.

Proof-producing software must create the active proof version for new transactions. Historical synchronization still requires the older verifier and BLS rules, which is why those implementations remain present in Rusk even though they must not be used for newly produced post-Aegis data.

For current node maintenance procedures, see [Upgrade a Node](/operator/guides/upgrade-node/).

## Canonical Sources

- [Rusk 1.6.0 release](https://github.com/dusk-network/rusk/releases/tag/dusk-rusk-1.6.0)
- [Rusk 1.6.0 changelog](https://github.com/dusk-network/rusk/blob/dusk-rusk-1.6.0/rusk/CHANGELOG.md#160---2026-02-27)
- [Mainnet and testnet Aegis activation configuration](https://github.com/dusk-network/rusk/blob/dusk-rusk-1.6.0/rusk/src/lib/node/vm/config/known.rs)
- [Fork-aware PLONK selection](https://github.com/dusk-network/rusk/blob/dusk-rusk-1.6.0/rusk/src/lib/node/rusk.rs)
- [Versioned BLS implementation](https://github.com/dusk-network/rusk/blob/dusk-rusk-1.6.0/core/src/lib.rs)
- [Phoenix fee and refund checks](https://github.com/dusk-network/rusk/blob/dusk-rusk-1.6.0/core/src/transfer.rs)

[← Back to Network Updates](/updates/network/)
