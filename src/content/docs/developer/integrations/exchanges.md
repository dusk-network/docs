---
title: Exchange integration
description: Operate finalized Moonlight deposits and controlled DUSK withdrawals.
---

Exchange integrations should use Moonlight, Dusk's public account model. Phoenix addresses and shielded notes require a different custody and scanning model; users can move funds to a public account before depositing.

## Recommended architecture

| Component | Responsibility |
|---|---|
| Archive Rusk node | Supplies finalized Moonlight history and deterministic backfills |
| Deposit scanner | Filters accepted deposit types, writes idempotent credits, and advances block checkpoints |
| Custody ledger | Maps accounts or memos to customers and reconciles on-chain balances |
| Signing service | Protects keys, serializes Moonlight nonces, builds transactions, and stores signed bytes before submission |
| Broadcast node | Pre-verifies, propagates, and reports local mempool and ledger state |

Run nodes you control for production. Public endpoints are suitable for development but are not a substitute for your own availability, retention, and access policy.

## Deposits

Choose one attribution model:

- **Account per customer:** scan each assigned Moonlight account.
- **Shared account with memo:** scan the shared account, decode the memo from hex, and accept only your documented memo format.

Use the [Moonlight deposit scanner](/developer/integrations/historical_events/) against finalized archive history. It deliberately accepts direct Moonlight transfers only. Add contract payouts or Phoenix conversions only through separate, explicit event rules.

For every credit:

- store amounts as integer LUX (`1 DUSK = 1_000_000_000 LUX`);
- use the Dusk transaction ID as the idempotency key;
- quarantine missing, malformed, unknown, or reused customer metadata; and
- update credits and the block checkpoint atomically.

Do not credit from a balance change, local mempool entry, `transactions/included`, or an accepted but unfinalized block.

## Withdrawals

W3sper provides transaction builders and submission primitives, not a complete headless wallet. A signing service must supply protected recoverable keys and synchronized `Bookkeeper` state, including committed balances, pending transactions, and Moonlight nonces.

For each withdrawal:

1. Assign an internal withdrawal ID and reserve the next nonce atomically for the hot account.
2. Build and sign once, then persist the exact serialized transaction and its Dusk transaction ID before broadcasting.
3. Submit through W3sper or `POST /on/transactions/propagate`.
4. Treat `202 Accepted` only as successful routing. Query execution and finality before marking the withdrawal complete.
5. On a transport timeout, rebroadcast the same signed bytes instead of creating a new transaction blindly.

A same-nonce replacement must use a strictly higher gas price and has a different transaction ID. Reconcile both IDs and never credit or debit twice. See [Transaction lifecycle](/developer/integrations/tx-lifecycle/#mempool-behavior).

Use [Rusk Wallet](/use/wallets/#rusk-wallet) for operator-controlled manual transactions. For an automated signer, start from the [W3sper source and tests](https://github.com/dusk-network/rusk/tree/master/w3sper.js) and implement key storage, synchronization, nonce allocation, approval policy, and audit logging as owned infrastructure.

## Network access

| Network | Node base URL | Explorer |
|---|---|---|
| Mainnet | `https://nodes.dusk.network` | [explorer.dusk.network](https://explorer.dusk.network/) |
| Testnet | `https://testnet.nodes.dusk.network` | [apps.testnet.dusk.network/explorer](https://apps.testnet.dusk.network/explorer/) |

GraphQL is available at `POST <base_url>/graphql`. Transaction submission uses `POST <base_url>/on/transactions/propagate`. See the [HTTP API](/developer/integrations/http-api/) for request formats and node policy controls.

## Asset metadata

| Field | Value |
|---|---|
| Asset | DUSK |
| Smallest unit | LUX |
| Native decimals | 9 |
| Public account model | Moonlight |
| Consensus | Succinct Attestation |

ERC20 and BEP20 representations use 18 decimals. Keep their metadata and accounting separate from native DUSK. Users moving legacy representations to Dusk mainnet should follow the [migration guide](/learn/guides/mainnet-migration/).

## Custody controls

The [Dusk contract standards](https://github.com/dusk-network/contracts/tree/main/standards) include reusable multisig and access-control primitives. They are a starting point for Dusk-native custody policies, not a substitute for your own threat model, review, and operational controls.
