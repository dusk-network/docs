---
title: HTTP API
description: Query chain data, call contracts, broadcast transactions, and subscribe to node events over HTTP and WebSocket.
---

:::tip[Prefer W3sper First]
For application integrations, prefer the [W3sper SDK](/developer/integrations/w3sper). It wraps transaction building, proving, submission, and common node interactions.
:::

Dusk nodes expose two main low-level HTTP surfaces:

- **GraphQL** for chain, block, transaction, mempool, archive, and other node-indexed queries.
- **RUES-style `/on/...` routes** for transaction submission, contract calls, node operations, proof generation, driver management, and event subscriptions.

Use this page as an implementation guide for direct node integrations. Application code should normally use W3sper or another SDK layer unless it needs low-level node access.

You can also [download the Postman collection](/dusk_api_postman_collection.json) and import it into Postman.

## Base URLs

- **Mainnet**: `https://nodes.dusk.network`
- **Testnet**: `https://testnet.nodes.dusk.network`

All endpoints below are relative to one of these base URLs.

## Choosing the Right Surface

Use **GraphQL** when you need chain, block, transaction, mempool, archive, or other node-indexed data that is not part of a contract ABI.

Use **`/on/contracts:<contract_id>/<method>`** when you are querying a method exposed by a contract ABI.

Use **other `/on/...` routes** for node operations such as transaction submission, proof generation, driver management, and event subscriptions.

Some legacy `/on/...` shortcut routes still work for compatibility, but are deprecated. Prefer the replacement routes documented below.

## Request and Response Encoding

RUES-style `/on/...` endpoints accept both binary and text payloads.

### Request body

- If `Content-Type: application/octet-stream`, the request body is treated as **raw bytes**.
- Otherwise, the request body is treated as **UTF-8 text**.
  - If the text starts with `0x`, the server will try to decode it as hex and treat it as bytes.

This is why most examples send serialized transactions and proofs as a `0x...` hex string.

### Binary responses

Some endpoints return binary data. By default, binary responses are returned as **hex text** unless you request raw bytes:

- To force a raw binary response, set `Accept: application/octet-stream`.

## Version Headers

Nodes include a `Rusk-Version` header in responses.

Clients can optionally send:

- `Rusk-Version`: a semver requirement string, for example `^1.4.0`.
- `Rusk-Version-Strict`: if present, the node requires `Rusk-Version` and performs a strict version check.

If the requested version is incompatible, the node rejects the request.

## GraphQL Queries

**Endpoint**: `/graphql`
**Method**: `POST`
**Body**: a GraphQL-over-HTTP JSON request.

Use GraphQL for chain, block, transaction, mempool, archive, and other node-indexed data.

:::note
Archive-only GraphQL fields such as `moonlightHistory`, `fullMoonlightHistory`, and `finalizedEvents` require an archive-enabled node.
:::

### Query example: latest block

```sh
curl -s -X POST "https://nodes.dusk.network/graphql" \
  -H "Content-Type: application/json" \
  --data-raw '{"query":"{ block(height: -1) { header { height hash } } }"}' | jq .
```

### Query example: with variables

```sh
curl -s -X POST "https://nodes.dusk.network/graphql" \
  -H "Content-Type: application/json" \
  --data-raw '{
    "query": "query ($height: Int!) { block(height: $height) { header { height hash } } }",
    "variables": { "height": -1 }
  }' | jq .
```

### Legacy raw-query endpoint

`POST /on/graphql/query` is the legacy RUES GraphQL route. It accepts a raw GraphQL query string, and an empty body returns the schema SDL.

Prefer `/graphql` for new integrations.

```sh
curl -s -X POST "https://nodes.dusk.network/on/graphql/query" \
  --data-raw 'query { block(height: -1) { header { height hash } } }' | jq .
```

Legacy GraphQL variables can be passed through request headers using the `rusk-gqlvar-` prefix, for example `rusk-gqlvar-height: 123`.

## Route Model and Deprecated Shortcuts

New integrations should avoid legacy shortcut routes when the same data is available through GraphQL, a contract ABI query, or contract metadata.

### Current route model

- `/graphql` is the canonical GraphQL endpoint for chain, mempool, block, transaction, and archive queries.
- `/on/contracts:<contract_id>/<method>` is the contract ABI query/call surface.
  - `POST` executes a read/query call.
  - `GET` and `DELETE` on the same path subscribe and unsubscribe from contract events, using `Rusk-Session-Id`.
  - With `Content-Type: application/json`, Rusk uses the contract data driver to encode input and decode output.
- `/on/contract:<contract_id>/<topic>` is the contract metadata and driver-management surface.
  - Common topics: `metadata`, `download_driver`, and `upload_driver`.
- `/on/driver:<contract_id>/<method>` is the data-driver utility surface.

### Deprecated routes

The following routes still work, but emit deprecation headers and are scheduled for removal:

- `/on/account:<account_bls_pk>/status`
- `/on/contract:<contract_id>/status`
- `/on/contract_owner:<contract_id>/<topic>`

Deprecated responses include:

```text
deprecation: true
deprecation-note: This endpoint is deprecated and scheduled for removal
```

`/on/contract_owner:<contract_id>/<topic>` also advertises its successor:

```text
Link: </on/contract:<contract_id>/metadata>; rel="successor-version"
```

### Migration summary

| Deprecated route | Use instead | Notes |
|---|---|---|
| `/on/account:<account_bls_pk>/status` | `POST /on/contracts:0100000000000000000000000000000000000000000000000000000000000000/account` | Returns committed `balance` and `nonce`. It does not return the old mempool-aware `next_nonce`. |
| `/on/contract:<contract_id>/status` | `POST /on/contracts:0100000000000000000000000000000000000000000000000000000000000000/contract_balance` | Returns the scalar balance directly instead of `{ "balance": ... }`. |
| `/on/contract_owner:<contract_id>/<topic>` | `POST /on/contract:<contract_id>/metadata` | Read `contract_owner` from the metadata response. The legacy `{topic}` segment was ignored. |

The transfer genesis contract ID used for account and contract-balance queries is:

```text
0100000000000000000000000000000000000000000000000000000000000000
```

To inspect the transfer contract query surface directly, use its data driver schema:

```sh
curl -s -X POST \
  "https://nodes.dusk.network/on/driver:0100000000000000000000000000000000000000000000000000000000000000/get_schema" | jq .
```

## Common HTTP Endpoints

All endpoints in this section are **HTTP `POST`** calls.

### Node

- **Node Info**: `/on/node/info`
- **Provisioners**: `/on/node/provisioners`
- **Common Reference String (CRS)**: `/on/node/crs`

Example:

```sh
curl -s -X POST "https://nodes.dusk.network/on/node/info" | jq .
```

### Network

- **Peers**: `/on/network/peers`
  - Request body: number of peers to return.
- **Peers Location**: `/on/network/peers_location`

Example:

```sh
curl -s -X POST "https://nodes.dusk.network/on/network/peers" \
  --data-raw '5' | jq .
```

### Gas and Fees

- **Gas Price Statistics**: `/on/blocks/gas-price`

Optional request body: max number of mempool transactions to consider. Defaults to all.

```sh
curl -s -X POST "https://nodes.dusk.network/on/blocks/gas-price" | jq .
```

### Transactions

- **Preverify**: `/on/transactions/preverify`
- **Propagate**: `/on/transactions/propagate`
- **Simulate**: `/on/transactions/simulate`

For `preverify`, `propagate`, and `simulate`, send the serialized transaction as bytes, for example as a `0x...` hex string.

Example format:

```sh
curl -s -X POST "https://nodes.dusk.network/on/transactions/preverify" \
  --data-raw '0x01ec00000000000000...'
```

### Accounts

:::warning[Deprecated shortcut]
`/on/account:<account_bls_pk>/status` is deprecated. Use the transfer contract `account` query instead.
:::

Use the transfer genesis contract to query committed account state:

**Endpoint**: `/on/contracts:0100000000000000000000000000000000000000000000000000000000000000/account`

```sh
curl -s -X POST \
  "https://nodes.dusk.network/on/contracts:0100000000000000000000000000000000000000000000000000000000000000/account" \
  -H "Content-Type: application/json" \
  --data-raw '"<ACCOUNT_BLS_PK_BASE58>"' | jq .
```

Response:

```json
{
  "nonce": "7",
  "balance": "1000"
}
```

The deprecated account shortcut also returned `next_nonce`. That value was derived from pending mempool transactions and has no exact one-call successor.

For most clients, use `Number(nonce) + 1`. If you need mempool-aware nonce allocation, derive it client-side using GraphQL mempool data.

### Contracts

#### Contract ABI calls

To query a contract method:

**Endpoint**: `/on/contracts:<contract_id>/<method>`
**Method**: `POST`

- If you send `Content-Type: application/octet-stream`, the request body is treated as raw bytes.
- If you send `Content-Type: application/json`, and the node has a data driver for the contract, the request body is treated as JSON input and encoded automatically.

Example format:

```sh
curl -s -X POST \
  "https://nodes.dusk.network/on/contracts:<contract_id>/<method>" \
  -H "Content-Type: application/json" \
  --data-raw '<json-input>' | jq .
```

#### Contract metadata and drivers

- **Contract Metadata**: `/on/contract:<contract_id>/metadata`
- **Download Data Driver**: `/on/contract:<contract_id>/download_driver`
- **Upload Data Driver**: `/on/contract:<contract_id>/upload_driver`
  - Requires a `sign` header.

The deprecated `/on/contract_owner:<contract_id>/<topic>` route has been replaced by contract metadata. Read `contract_owner` from the metadata response.

Example:

```sh
curl -s -X POST \
  "https://nodes.dusk.network/on/contract:<contract_id>/metadata" | jq .
```

Example response:

```json
{
  "owner": "<OWNER_BLS_PK_BASE58>",
  "contract_owner": "<OWNER_HEX>",
  "driver_available": true,
  "driver_signature": "<SIGNATURE_HEX_OR_NULL>",
  "created_at": null
}
```

#### Contract balance

:::warning[Deprecated shortcut]
`/on/contract:<contract_id>/status` is deprecated. Use the transfer contract `contract_balance` query instead.
:::

Use the transfer genesis contract to query a contract balance:

**Endpoint**: `/on/contracts:0100000000000000000000000000000000000000000000000000000000000000/contract_balance`

```sh
curl -s -X POST \
  "https://nodes.dusk.network/on/contracts:0100000000000000000000000000000000000000000000000000000000000000/contract_balance" \
  -H "Content-Type: application/json" \
  --data-raw '"<TARGET_CONTRACT_ID_HEX>"'
```

Replacement response:

```json
"123456"
```

The replacement route returns the scalar balance value directly. The deprecated route wrapped that same value as `{ "balance": ... }`.

#### Data drivers

Drivers allow encoding and decoding contract data.

**Endpoint**: `/on/driver:<contract_id>/<method>`

Common methods:

- `get_schema`
- `get_version`
- `encode_input_fn:<fn_name>`
- `decode_input_fn:<fn_name>`
- `decode_output_fn:<fn_name>`
- `decode_event:<event_name>`

Example:

```sh
curl -s -X POST \
  "https://nodes.dusk.network/on/driver:<contract_id>/get_schema" | jq .
```

### Blobs

- **Blob by commitment**: `/on/blobs:<commitment>/commitment`
- **Blob by hash**: `/on/blobs:<hash>/hash`

To retrieve a JSON sidecar instead of raw bytes, set `Content-Type: application/json`.

Example:

```sh
curl -s -X POST \
  "https://nodes.dusk.network/on/blobs:<hash>/hash" \
  -H "Content-Type: application/json" | jq .
```

### Stats

Archive-enabled nodes expose:

- **Active public accounts**: `/on/stats/account_count`
- **Finalized transaction count**: `/on/stats/tx_count`

Example:

```sh
curl -s -X POST "https://nodes.dusk.network/on/stats/tx_count" | jq .
```

## Prover Endpoints

- **Prove**: `/on/prover/prove`

Send proof input as bytes, for example as a `0x...` hex string. The response is proof bytes.

```sh
curl -s -X POST "https://nodes.dusk.network/on/prover/prove" \
  --data-raw '0x...' \
  --output proof.bin
```

## Event Subscriptions

Subscriptions are a two-step process:

1. Open a WebSocket connection to `wss://<node>/on`.
2. Use the session ID from that WebSocket to `GET` or `DELETE` subscriptions over HTTP.

### WebSocket session

Connect to:

```text
wss://nodes.dusk.network/on
```

The node sends the **session ID as the first WebSocket text message**. Use that value in the `Rusk-Session-Id` header.

### Event URI format

```text
/on/<component>[:<entity>]/<topic>
```

- `component` and `topic` are case-insensitive and normalized to lowercase.
- `entity` is optional for `blocks` and `transactions`, which allows wildcard subscriptions.
- `entity` is required for `contracts`.

Common topics:

- `blocks`: `accepted`, `statechange`, `reverted`
- `transactions`: `included`, `removed`, `executed`
- `contracts`: contract-specific event topics, usually emitted event names

Examples:

- All accepted blocks: `/on/blocks/accepted`
- A specific block: `/on/blocks:<block_hash>/accepted`
- All executed transactions: `/on/transactions/executed`
- Contract events: `/on/contracts:<contract_id>/<event_name>`

### Subscribe

```sh
curl -i -X GET "https://nodes.dusk.network/on/blocks/accepted" \
  -H "Rusk-Session-Id: <session_id>"
```

### Unsubscribe

```sh
curl -i -X DELETE "https://nodes.dusk.network/on/blocks/accepted" \
  -H "Rusk-Session-Id: <session_id>"
```

On success, the node returns `200 OK` with an empty body. Events are delivered over the WebSocket connection.

If the session ID is missing or invalid, the node returns `424 Failed Dependency`.

## Event Payload Format

Events are sent as WebSocket **binary messages**:

1. `u32` little-endian: length of the JSON header.
2. JSON header bytes, including `Content-Location`.
3. Raw event data bytes. The format depends on the event.

If you need historical data, use an archive-enabled node and GraphQL queries such as `moonlightHistory`, `fullMoonlightHistory`, and `finalizedEvents`.

See: [Retrieve historical events](/developer/integrations/historical_events).
