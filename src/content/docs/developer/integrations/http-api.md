---
title: HTTP API
description: Query nodes, broadcast transactions, and subscribe to real-time events using RUES over HTTP and WebSocket.
---

The <a href="https://github.com/dusk-network/rusk/wiki/RUES-%28Rusk-Universal-Event-System%29" target="_blank"><strong>Rusk Universal Event System (RUES)</strong></a> is the public interface exposed by Dusk nodes.

- Use **HTTP `POST`** for request/response calls (query node state, submit transactions, generate proofs, etc.).
- Use **WebSocket + HTTP `GET`/`DELETE`** for real-time event subscriptions.

You can also [download the Postman collection](/dusk_api_postman_collection.json) and import it into Postman.

## Base URLs

- **Mainnet**: `https://nodes.dusk.network`
- **Testnet**: `https://testnet.nodes.dusk.network`

All endpoints below are relative to one of these base URLs.

## Request and Response Encoding

RUES endpoints accept both binary and text payloads.

### Request body

- If `Content-Type: application/octet-stream`, the request body is treated as **raw bytes**.
- Otherwise, the request body is treated as **UTF-8 text**.
  - If the text starts with `0x`, the server will try to decode it as hex and treat it as bytes.

This is why most examples send serialized transactions and proofs as a `0x...` hex string.

### Binary responses

Some endpoints return binary data. By default, binary responses are returned as **hex text** unless you request raw bytes:

- To force a raw binary response, set `Accept: application/octet-stream`.

## Version Headers (Optional)

Nodes include a `Rusk-Version` header in responses.

Clients can optionally send:

- `Rusk-Version`: a semver requirement string (example: `^1.4.0`).
- `Rusk-Version-Strict`: if present, the node requires `Rusk-Version` and performs a strict version check.

If the requested version is incompatible, the node rejects the request.

## GraphQL Queries

**Endpoint**: `/on/graphql/query`  
**Method**: `POST`  
**Body**: a GraphQL query string.

### Get the schema (SDL)

Send an empty body to retrieve the schema:

```sh
curl -s -X POST "https://nodes.dusk.network/on/graphql/query"
```

### Query example: latest block

```sh
curl -s -X POST "https://nodes.dusk.network/on/graphql/query" \
  --data-raw 'query { block(height: -1) { header { height hash } } }'
```

:::note
GraphQL variables can be passed via request headers using the prefix `rusk-gqlvar-`, for example: `rusk-gqlvar-height: 123`.
:::

## Common HTTP Endpoints

All endpoints below are **HTTP `POST`** calls.

### Node

- **Node Info**: `/on/node/info`
- **Provisioners**: `/on/node/provisioners`
- **Common Reference String (CRS)**: `/on/node/crs`

Example:

```sh
curl -s -X POST "https://nodes.dusk.network/on/node/info" | jq .
```

### Network

- **Peers** (request body: number of peers): `/on/network/peers`
- **Peers Location**: `/on/network/peers_location`

Example:

```sh
curl -s -X POST "https://nodes.dusk.network/on/network/peers" --data-raw '5' | jq .
```

### Gas and Fees

- **Gas Price Statistics**: `/on/blocks/gas-price`

Optional request body: max number of mempool transactions to consider (defaults to all).

```sh
curl -s -X POST "https://nodes.dusk.network/on/blocks/gas-price" | jq .
```

### Transactions

- **Preverify** (validate tx without broadcasting): `/on/transactions/preverify`
- **Propagate** (broadcast tx): `/on/transactions/propagate`
- **Simulate** (estimate gas): `/on/transactions/simulate`

:::note[Important]
For `preverify`, `propagate` and `simulate`, send the serialized transaction as bytes (for example as a `0x...` hex string).
:::

Example (format only; replace with a real tx):

```sh
curl -s -X POST "https://nodes.dusk.network/on/transactions/preverify" \
  --data-raw '0x01ec00000000000000...'
```

### Accounts

- **Account Status**: `/on/account:<address>/status`

Returns:

```json
{ "balance": 0, "nonce": 0, "next_nonce": 1 }
```

Example:

```sh
curl -s -X POST "https://nodes.dusk.network/on/account:<address>/status" | jq .
```

### Contracts

- **Contract Balance**: `/on/contract:<contract_id>/status`
- **Contract Metadata**: `/on/contract:<contract_id>/metadata`
- **Download Data Driver**: `/on/contract:<contract_id>/download_driver`
- **Upload Data Driver**: `/on/contract:<contract_id>/upload_driver` (requires a `sign` header)

#### Contract Calls (Queries)

To query a contract method:

**Endpoint**: `/on/contracts:<contract_id>/<fn_name>`

- If you send `Content-Type: application/octet-stream`, the request body is treated as raw bytes.
- If you send `Content-Type: application/json` and the node has a data driver for the contract, the request body is treated as JSON input and encoded automatically.

#### Data Drivers

Drivers allow encoding/decoding contract data.

**Endpoint**: `/on/driver:<contract_id>/<method>[:<target>]`

Common methods:

- `get_schema`
- `get_version`
- `encode_input_fn:<fn_name>`
- `decode_input_fn:<fn_name>`
- `decode_output_fn:<fn_name>`
- `decode_event:<event_name>`

### Blobs

- **Blob by commitment**: `/on/blobs:<commitment>/commitment`
- **Blob by hash**: `/on/blobs:<hash>/hash`

To retrieve a JSON sidecar instead of raw bytes, set `Content-Type: application/json`.

### Stats

- **Active public accounts (archive)**: `/on/stats/account_count`
- **Finalized tx count (archive)**: `/on/stats/tx_count`

## Prover Endpoints

- **Prove**: `/on/prover/prove`

Send proof input as bytes (for example as a `0x...` hex string). The response is proof bytes (binary).

## Event Subscriptions

Subscriptions are a 2-step process:

1. Open a WebSocket connection to `wss://<node>/on`.
2. Use the session ID from that WebSocket to `GET`/`DELETE` subscriptions over HTTP.

### WebSocket session

Connect to:

```
wss://nodes.dusk.network/on
```

The node sends the **session ID as the first WebSocket text message** (16 bytes, hex-encoded). Use that value in the `Rusk-Session-Id` header.

### Event URI format

```
/on/<component>[:<entity>]/<topic>
```

- `component` and `topic` are case-insensitive (normalized to lowercase).
- `entity` is optional for `blocks` and `transactions` (wildcard subscription), but required for `contracts`.

Common topics:

- `blocks`: `accepted`, `statechange`, `reverted`
- `transactions`: `included`, `removed`, `executed`
- `contracts`: contract-specific event topics (emitted event names)

Examples:

- All accepted blocks: `/on/blocks/accepted`
- A specific block: `/on/blocks:<block_hash>/accepted`
- All executed txs: `/on/transactions/executed`
- Contract events: `/on/contracts:<contract_id>/<event_name>`

### Subscribe / Unsubscribe

Subscribe:

```sh
curl -i -X GET "https://nodes.dusk.network/on/blocks/accepted" \
  -H "Rusk-Session-Id: <session_id>"
```

Unsubscribe:

```sh
curl -i -X DELETE "https://nodes.dusk.network/on/blocks/accepted" \
  -H "Rusk-Session-Id: <session_id>"
```

On success, the node returns `200 OK` with an empty body. Events are delivered over the WebSocket connection.

If the session ID is missing/invalid, the node returns `424 Failed Dependency`.

## Event Payload Format (WebSocket)

Events are sent as WebSocket **binary messages**:

1. `u32` little-endian: length of the JSON header.
2. JSON header bytes (includes `Content-Location`).
3. Raw event data bytes (format depends on the event).

If you need historical data (archive), use GraphQL queries such as `moonlightHistory` and `finalizedEvents`.
See: [Retrieve historical events](/developer/integrations/historical_events).
