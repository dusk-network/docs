---
title: HTTP API
description: Discover the HTTP API and events system of Dusk, designed for efficient event processing of regulated financial markets and institutions.
---

The <a href="https://github.com/dusk-network/rusk/wiki/RUES-%28Rusk-Universal-Event-System%29" target="_blank">**Rusk Universal Event System (RUES)**</a> is an integral part of the architecture of Dusk, providing a powerful mechanism for handling real-time communication with an event-driven approach.

RUES is designed to handle binary proofs, binary streams, and on-demand event-driven data, making it ideal for applications that need to process binary proofs or continuous binary data streams.
It also enables on-demand data dispatching and real-time notifications, supporting applications like wallet operations that require high-performance binary data handling.
This is achieved by avoiding the need to convert data to JSON or base64.


Data can be fetched from the following endpoints:

- **Mainnet**: https://nodes.dusk.network/
- **Testnet**: https://nodes.testnet.dusk.network/

These links also provide access to archive-related endpoints for comprehensive historical data retrieval.

## Session Management

Before interacting with RUES, clients must establish a WebSocket session with a Rusk node. This session forms the backbone of real-time event streaming between the client and the node.

### Session Initialization

To start a session, initiate a WebSocket connection to the node. Upon connection, the server responds with a `Rusk-Session-Id`, a 16 byte random nonce that is essential for event subscriptions and dispatches.

```
wss://[node-address]/on
```

### Session Persistence 

Ensure that your WebSocket connection remains open for as long as you require real-time event streaming. In a load-balanced environment, consistent routing is required to maintain session persistence.

### Session Termination

Sessions can be terminated by either the client or the server. When the WebSocket connection is closed, all event subscriptions are automatically canceled.

## Event Identification

Every event in RUES is identified by a unique URL structure, which allows for fine-grained interaction with blockchain components.

### Event URL Structure

```
/on/[target]/[topic]
```

- **target**: The blockchain component (e.g., `contracts`, `transactions`, `blocks`, `node`, `graphql`).
- **topic**: The event type (e.g., `accepted`, `statechange`, `propagate`).

**Example URLs**:
- **General Event**: `/on/contracts/deploy`
- **Specific Event**: `/on/contracts:contract_id/[topic]`

In more granular cases, the `target` can represent specific elements within components. For example:

```
/on/transactions:transaction_id/included
/on/blocks:block_hash/accepted
```

## Event Subscriptions

RUES enables clients to subscribe to specific events on a node. Subscriptions use the HTTP `GET` method and require the `Rusk-Session-Id` for authentication.

### Subscribe

#### Request

```
GET https://[node-address]/on/[target]/[topic]
```

#### Example

```
GET https://nodes.dusk.network/on/contracts:efda355bc94a3be09006dc90f3714a0ee22c586c5e577e429ef3b5e3e464a8da/item-added
```

#### Headers

| Name              | Description                           |
| ----------------- | ------------------------------------- |
| `Rusk-Version`    | Specifies the compatible Rusk version |
| `Rusk-Session-Id` | Identifies the current session        |

#### Response Codes

| Status code             | When                                  |
| ----------------------- | ------------------------------------- |
| `200 OK`                | Successful subscription               |
| `400 Bad Request`       | `Rusk-Version` incompatibility        |
| `424 Failed Dependency` | `Rusk-Session-Id` issues              |
| `404 Not Found`         | `[component]` or `[target]` not found |

### Unsubscribe

To unsubscribe from an event, use the HTTP `DELETE` method.

#### Request

```
DELETE https://[node-address]/on/[target]/[topic]
```

#### Example 

```
DELETE https://nodes.dusk.network/on/contracts:efda355bc94a3be09006dc90f3714a0ee22c586c5e577e429ef3b5e3e464a8da/item-removed
```

#### Headers

| Name              | Description                           |
| ----------------- | ------------------------------------- |
| `Rusk-Version`    | Specifies the compatible Rusk version |
| `Rusk-Session-Id` | Identifies the current session        |

#### Response Codes

| Status code             | When                                             |
| ----------------------- | ------------------------------------------------ |
| `200 OK`                | Successful unsubscription                        |
| `400 Bad Request`       | `Rusk-Version` incompatibility                   |
| `424 Failed Dependency` | `Rusk-Session-Id` issues                         |
| `404 Not Found`         | `[component]`, `[target]` or `[topic]` not found |

## Event Dispatch

Dispatching events allows clients to send specific data to the node and request data. The `POST` method is used for this purpose, often including a request body with the event payload.

### Dispatch

#### Request

```
POST https://[node-address]/on/[target]/[topic]
```

#### Example

```
POST https://nodes.dusk.network/on/contracts:efda355bc94a3be09006dc90f3714a0ee22c586c5e577e429ef3b5e3e464a8da/sync
```

#### Headers

| Name              | Description                                                 |
| ----------------- | ----------------------------------------------------------- |
| `Rusk-Version`    | Specifies the compatible Rusk version                       |
| `Rusk-Session-Id` | Identifies the current session                              |
| `Content-Type`    | Usually `application/json` or `application/octet-stream`    |
| `Content-Length`  | The length of the message body in octets (8-bit bytes)    |
| `Accept`          | Media type(s) that is/are acceptable for a response message |

#### Response Codes

| Status code                 | When                                                                      |
| --------------------------- | ------------------------------------------------------------------------- |
| `200 OK`                    | Event received succesfully, response generated |
| `202 Accepted`              | Event accepted for processing                                      |
| `400 Bad Request`           | `Rusk-Version` mismatch                                                   |
| `424 Failed Dependency`     | `Rusk-Session-Id` mismatch                                          |
| `404 Not Found`             | `[component]`, `[target]`, or `[topic]` not found          |
| `422 Unprocessable Content` | Payload cannot be processed with the  given `Content-Type`        |

## General Endpoints

These are endpoints accessible regardless of the node role. They include queries for general blockchain state and node information.

You can [download the Postman collection](/dusk_api_postman_collection.json) with example usage and more documentation 
of these endpoints and import it into [Postman](https://www.postman.com).

### GraphQL Queries

**Endpoint**: `/on/graphql/query`

Enables GraphQL-style queries against the Dusk blockchain.

**Method**: `POST`

**Example Request**: 

```
POST https://nodes.dusk.network/on/graphql/query
```

**Request Body**:

Example query for requesting the latest block.

```graphql
query { block(height: -1) { header { height } } }
```

**Example Response**:

```json
{
    "block": {
        "header": {
            "height": 20241015
        }
    }
}
```

### Node

#### Node Info

**Endpoint**: `/on/node/info`

Retrieves general information about the node, like the chain ID of the network the node operates on, its bootstrapping nodes, the Rusk version it uses and its Kadcast IP address.

**Method**: `POST`

**Example Request**: 

```
POST https://nodes.dusk.network/on/node/info
```

**Example Response**:

```json
{
    "bootstrapping_nodes": [
        "173.212.198.91:9000",
        "188.34.201.78:9000",
        "94.72.105.11:9000",
        "64.44.41.61:9000",
        "158.220.83.234:9000"
    ],
    "chain_id": 48,
    "kadcast_address": "127.0.0.1:9000",
    "version": "0.8.0",
    "version_build": "0.8.0 (027b9787 2024-09-14)"
}
```

#### Provisioners

**Endpoint**: `/on/node/provisioners`

Fetches the list of provisioners (validators).

**Method**: `POST`

**Example Request**: 

```
POST https://nodes.dusk.network/on/node/provisioners
```

**Example Response**:

```json
[
    {
        "amount": 0,
        "eligibility": 0,
        "key": "mvft6AXjR1mDtg1Qo3GzGBKZAvvxY1S6h41DSEPh9Ewj9GFR61rPQnjVaM1W9nqkHijRC2d5Yo4FSBwU8wf9eHeEJYXuMSrB7eJxvsY6HjCeDJ9pKfJLdjayAfrxEyudvx2",
        "reward": 943226500000
    },
    {
        "amount": 1000000000000,
        "eligibility": 0,
        "key": "oCqYsUMRqpRn2kSabH52Gt6FQCwH5JXj5MtRdYVtjMSJ73AFvdbPf98p3gz98fQwNy9ZBiDem6m9BivzURKFSKLYWP3N9JahSPZs9PnZ996P18rTGAjQTNFsxtbrKx79yWu",
        "reward": 8485066974496
    }
]
```

#### Common Reference String (CRS)

**Endpoint**: `/on/node/crs`

Retrieves the CRS used by the network.

**Method**: `POST`

**Example Request**: 

```
POST https://nodes.dusk.network/on/node/crs
```

**Example Response**:

```
a9909cd1...580a0000
```

### Blocks

#### Block Events

**Endpoint**: `/on/blocks:[block-hash]/[topic]`, where `[topic]` is optional. Block events can have the topic `accepted, `statechange`, or `reverted`.

- **accepted**: Indicates that a block has been accepted into the chain.
- **statechange**: Represents a change in the state of a block. The state of a block can be either `finalized` or `confirmed`.
- **reverted**: Indicates that a block has been removed from the chain because it got reverted during consensus.

**Method**: `GET`

**Example Request**:

This example request listens to the `accepted` topic for a given block.

```
GET https://nodes.dusk.network/on/blocks/accepted
```

**Example Event**:

The event is returned as raw binary data. Ensure that your client can properly handle these formats according to the RUES specifications.
Example for a newly accepted block.

```hexdump
00000000: 6B 00 00 00 7B 22 43 6F 6E 74 65 6E 74 2D 4C 6F    k...{"Content-Lo
00000010: 63 61 74 69 6F 6E 22 3A 22 2F 6F 6E 2F 62 6C 6F    cation":"/on/blo
00000020: 63 6B 73 3A 37 34 31 61 66 62 62 36 37 61 31 61    cks:741afbb67a1a
...
00000540: 30 30 30 30 30 30 30 30 30 30 30 22 2C 22 76 65    00000000000","ve
00000550: 72 73 69 6F 6E 22 3A 31 7D 2C 22 74 72 61 6E 73    rsion":1},"trans
00000560: 61 63 74 69 6F 6E 73 22 3A 5B 5D 7D                actions":[]}
```

#### Gas Price

This endpoint retrieves the gas price for the latest blocks.

**Endpoint**: `/on/blocks/gas-price`

**Method**: `POST`

**Example Request**:

```bash
POST https://nodes.dusk.network/on/blocks/gas-price
```

**Example Response**:

```json
{
    "average": 1,
    "max": 1,
    "median": 1,
    "min":1
}
```

### Transactions

#### Transaction Events

**Endpoint**: `/on/transactions/[topic]`, where `[topic]` is mandatory. Transaction events can have the topic `Removed`, `Included`, or `Executed`.

- **Removed**: Indicates that the transaction has been removed from the mempool.
- **Included**: A transaction has been included in the mempool.
- **Executed**: A transaction that has been executed in an accepted block.

**Method**: `GET`

**Example Request**:

This example request listens to the `Executed` topic for any incoming transaction.

```
GET https://nodes.dusk.network/on/transactions/Executed
```

**Example Event**:

The event is returned as raw binary data. Ensure that your client can properly handle these formats according to the RUES specifications.
Example for an executed Moonlight transaction.

```
00000000: 71 00 00 00 7B 22 43 6F 6E 74 65 6E 74 2D 4C 6F    q...{"Content-Lo
00000010: 63 61 74 69 6F 6E 22 3A 22 2F 6F 6E 2F 74 72 61    cation":"/on/tra
00000020: 6E 73 61 63 74 69 6F 6E 73 3A 37 63 34 33 36 35    nsactions:7c4365
...
00000230: 79 70 65 22 3A 22 6D 6F 6F 6E 6C 69 67 68 74 22    ype":"moonlight"
00000240: 2C 22 76 61 6C 75 65 22 3A 31 30 30 30 30 30 30    ,"value":1000000
00000250: 30 30 30 7D 7D                                     000}}
```

#### Preverify

This endpoint checks whether a transaction is valid before execution or propagation. It does not broadcast nor execute the transaction: it only verifies its format and validity against network rules, without adding it to the mempool.

:::note[Important]
The request body must start with `0x` to indicate hex encoding.
:::

:::note[Note]
The transaction in this example is invalid: it is only meant to demonstrate the request format. Always replace this with a valid serialized transaction.
:::


**Endpoint**: `/on/transactions/preverify`

**Method**: `POST`

**Example Request**:

```
curl -L -X POST 'https://nodes.dusk.network/on/transactions/preverify' \
--data-raw '0x01ec00000000000000fa8d31d41cb190cb54fab965d3edba820a8e8fc5cdf5df2ef0b17ed7b318c290808564ec96651502cb086f4e2317de88441376dca3359fcf084a904343591c9c6d420dea1e576a957120af2ea4c46ef9d3bb1394ad3cbc92413c59b1ce518c085001b6532a7b799b7911b4631bb91c07f2d1b10b0641cdb8fdf53bfc8194c9700e22d2fe0068142786be7a79cce92920d2a518dd851e2d7ee65addb2d79f7a8f8487d6df24627a5bf74428e060be27adca21250cb3382c2a4c8b4a78b699c1d752c940420f0000000000000000000000000000e1f50500000000010000000000000000010000000000000000a1684a2771ef0a7c71f1e681951e98c823c0eeac4a9aab1f561223b68b35d0dc25b0ffdad5aa89f78fd859b94a1ae184'
```

**Request Body**:

The request body should contain a hex-encoded, serialized transaction, prefixed with `0x`. Ensure that the transaction is properly serialized before submission.

Example below is truncated for readability:

```
0xa9909cd1...580a0000
```

**Example Response**:

Upon success, the transaction is pre-verified, but no specific data is returned unless there is an error.


#### Propagate

This endpoint propagates a transaction across the network so that nodes can process it and include it in the blockchain.

:::note[Important]
The request body must start with `0x` to indicate hex encoding.
:::

:::note[Note]
The transaction in this example is invalid: it is only meant to demonstrate the request format. Always replace this with a valid serialized transaction.
:::


**Endpoint**: `/on/transactions/propagate`

**Method**: `POST`

**Example Request**:

```
curl -L -X POST 'https://nodes.dusk.network/on/transactions/propagate' \
--data-raw '0x01ec00000000000000fa8d31d41cb190cb54fab965d3edba820a8e8fc5cdf5df2ef0b17ed7b318c290808564ec96651502cb086f4e2317de88441376dca3359fcf084a904343591c9c6d420dea1e576a957120af2ea4c46ef9d3bb1394ad3cbc92413c59b1ce518c085001b6532a7b799b7911b4631bb91c07f2d1b10b0641cdb8fdf53bfc8194c9700e22d2fe0068142786be7a79cce92920d2a518dd851e2d7ee65addb2d79f7a8f8487d6df24627a5bf74428e060be27adca21250cb3382c2a4c8b4a78b699c1d752c940420f0000000000000000000000000000e1f50500000000010000000000000000010000000000000000a1684a2771ef0a7c71f1e681951e98c823c0eeac4a9aab1f561223b68b35d0dc25b0ffdad5aa89f78fd859b94a1ae184'
```

**Request Body**:


The request body should contain a hex-encoded, serialized transaction, prefixed with `0x`. Ensure that the transaction is properly serialized before submission.



Example below is truncated for readability:

```
0xa9909cd1...580a0000
```

**Example Response**:

Upon success, the transaction is propagated across the network. This endpoint returns a response indicating success but no specific data.

### Contracts

#### Contract Events

**Endpoint**: `/on/contracts:[contract-id]/[event-name]`, where `[event-name]` is optional. If the event name is not provided, the connection will listen to all events on the given contract.

**Method**: `GET`

**Example Request**:

This example request listens to `stake` events from the stake contract.

```
GET https://nodes.dusk.network/on/contracts:0200000000000000000000000000000000000000000000000000000000000000/stake
```

**Example Event**: 

The event is returned as raw binary data. Ensure that your client can properly handle these formats according to the RUES specifications.
Example for a stake event.

```
00000000: BC 00 00 00 7B 22 43 6F 6E 74 65 6E 74 2D 4C 6F    ....{"Content-Lo
00000010: 63 61 74 69 6F 6E 22 3A 22 2F 6F 6E 2F 63 6F 6E    cation":"/on/con
00000020: 74 72 61 63 74 73 3A 30 32 30 30 30 30 30 30 30    tracts:020000000
...
00000230: 34 B3 5B F3 E4 06 C9 C4 33 34 62 A3 38 6F A2 D5    4.[.....34b.8o..
00000240: 47 CC 52 71 A9 0F 1D 18 00 00 00 00 00 00 00 00    G.Rq............
00000250: 00 10 A5 D4 E8 00 00 00                            ........
```

### Network

#### Peers

This endpoint retrieves a list of peers connected to the node, where the given value is the amount of peers to return, if available.

**Endpoint**: `/on/network/peers`

**Method**: `POST`

**Example Request**:

```bash
POST https://nodes.dusk.network/on/network/peers
```

**Request Body**:

```
5
```

**Example Response**:

```bash
[
    "173.212.198.91:9000",
    "188.34.201.78:9000",
    "94.72.105.11:9000",
    "64.44.41.61:9000",
    "158.220.83.234:9000"
]
```

## Archive node Endpoints

These endpoints provide access to historical data and events stored by archive nodes.

### Moonlight Transaction History

This endpoint provides access to the Moonlight transaction history stored by archive nodes in an efficient way. 

Details to be filled in based on implementation.

### Historical Events

This endpoint provides access to other historical events in the blockchain. 

Details to be filled in based on implementation.

## Prover Endpoints

The Provers in the network are responsible for generating Zero-Knowledge proofs. These endpoints offer proof-related functionality.

### Prove

This endpoint triggers the prover to generate a Zero-Knowledge proof for the provided data.

**Endpoint**: `/on/prover/prove`

**Method**: `POST`

**Example Request**:

```
POST https://nodes.dusk.network/on/prover/prove
```

**Request Body**:

The request body should contain raw binary data 

```
a9909cd1...580a0000
```

**Example Response**:

Upon success, the prover will return the generated proof, likely as raw binary data.

```
a9909cd1...580a0000
```
