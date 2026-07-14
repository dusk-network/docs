---
title: Transaction lifecycle
description: Transaction families, mempool behavior, execution, and finality on the Dusk L1.
---

This page describes transactions submitted to the Dusk L1. DuskEVM has a separate [sequencer and finality model](/developer/duskevm/reference/#inclusion-and-finality).

## Transaction shape

A Dusk L1 transaction combines a value model with an optional action:

| Layer | Options | Operational effect |
|---|---|---|
| Value model | **Moonlight** or **Phoenix** | Moonlight uses public accounts and sequential nonces. Phoenix uses shielded notes and nullifiers. |
| Action | Transfer, memo, contract call, contract deployment, or blob | The action is carried by either transaction family. A contract call can also deposit DUSK into the called contract. |

Moonlight exposes its sender, optional receiver, value, nonce, fee, and optional memo. Phoenix hides transferred values and participants while exposing the cryptographic data needed to verify note spends.

A memo can accompany a direct transfer and is limited to 512 bytes. The transaction data field holds one of a memo, contract call, deployment, or blob payload; do not assume a memo can accompany the other payload types.

## Lifecycle

1. **Build and sign:** the client chooses the transaction family, action, gas limit, gas price, and current spend inputs or nonce.
2. **Submit:** the client sends serialized bytes to a node. `POST /on/transactions/propagate` returning `202 Accepted` means the node accepted the request for routing; it does not mean the transaction is in a block.
3. **Admit:** the node pre-verifies the transaction. A valid transaction enters that node's real mempool and emits `transactions/included`.
4. **Propagate:** the receiving node broadcasts an admitted transaction to peers. Each peer performs its own admission checks and maintains its own mempool.
5. **Select:** a block generator considers mempool transactions in descending gas-price order, subject to block limits and execution dependencies.
6. **Execute:** an accepted block emits `transactions/executed` for each spent transaction. `err: null` means execution succeeded; a non-null `err` records a contract panic or other execution failure. Either result consumes the nonce or notes and pays gas.
7. **Finalize:** accepted blocks can still be reverted. A `blocks/statechange` event with `state: "finalized"` makes the block and its transactions final.

Do not use **included**, **removed**, **accepted**, or **confirmed** as a payment-finality signal.

## Mempool behavior

| Question | Current behavior |
|---|---|
| Who can inspect it? | Anyone with GraphQL access to a node can query that node's real mempool through `mempoolTxs` or `mempoolTx`. This is a local view, not a network-wide snapshot. |
| How are transactions prioritized? | Candidate selection iterates by descending `gasPrice`. Equal-price ordering is not a client contract. |
| How does replacement work? | A transaction that conflicts on a spending ID replaces the existing transaction only when its gas price is strictly higher. Raising only the gas limit is insufficient. Moonlight uses account and nonce as its spending ID; Phoenix conflicts on spent nullifiers. |
| What happens when the mempool is full? | A higher-priced transaction can evict the lowest-priced entry. Node operators configure the capacity; the default is 10,000 transactions. |
| When do transactions expire? | Expiry is local node policy, not a field in the transaction. The default residence is three days, checked hourly, and both values are configurable. Clients must not treat three days as a network guarantee. |
| What happens to future Moonlight nonces? | A transaction with a nonce gap is briefly staged outside the real mempool while the node waits for intermediate nonces. It emits `deferred`, is invisible to `mempoolTxs`, and is admitted only if the gap is filled before retries end. |
| Can every node publish transactions? | A full Rusk node can receive and rebroadcast transactions. Its operator can disable or restrict public HTTP access, apply ACLs, or rate-limit propagation. |

`transactions/removed` only says that an entry left the local mempool. Inclusion in a block, replacement, expiry, capacity eviction, or removal of a conflicting transaction can all cause it. Query ledger state before deciding what happened.

## Events

RUES exposes these transaction topics:

| Topic | Meaning |
|---|---|
| `deferred` | Staged outside the real mempool because an admission prerequisite is missing |
| `dropped` | Discarded before entering the real mempool |
| `included` | Added to the local real mempool |
| `removed` | Removed from the local real mempool for any reason |
| `executed` | Executed in an accepted block; inspect `err` |

Block topics are `accepted`, `statechange`, and `reverted`. See the [HTTP API event model](/developer/integrations/http-api/#event-subscriptions) for subscription details.

## Confirm success

For a live transaction watcher:

1. Query `tx(hash: ...)` after execution and require `err` to be null.
2. Retain its `blockHeight` and `blockHash`.
3. On an archive node, require `checkBlock(height: ..., hash: ..., onlyFinalized: true)` to return `true`.
4. Store the transaction ID as an idempotency key.

Archive Moonlight history is populated only when blocks finalize. Deposit systems can therefore use the [finalized deposit scanner](/developer/integrations/historical_events/) instead of reconstructing finality from live events.

## Implementation references

- [Mempool admission and replacement](https://github.com/dusk-network/rusk/tree/master/node/src/mempool)
- [GraphQL transaction and mempool queries](https://github.com/dusk-network/rusk/blob/master/rusk/src/lib/http/chain/graphql/tx.rs)
- [Transaction and block event definitions](https://github.com/dusk-network/rusk/tree/master/node-data/src/events)
