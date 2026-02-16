---
title: Retrieve historical events
description: Documentation on the access to blockchain transaction history for public value transfers on Dusk.
---

## Overview

The GraphQL API provides access to finalized historical blockchain transaction-events, involving public (Moonlight) `DUSK` value transfers. It includes two primary endpoints:

1. `moonlightHistory`
2. `fullMoonlightHistory`

:::tip
The **moonlightHistory** endpoint allows for advanced filtering, enabling queries based on sender, receiver, block range, and pagination.**fullMoonlightHistory** retrieves all public `DUSK` value transfers for a given address, without additional filtering options.
:::

You can also checkout the [transaction models](/learn/deep-dive/duskds-tx-models) page, to get familiar with the terminology of `moonlight` & `phoenix`.

Refer to [GraphQL queries](/developer/integrations/http-api/#graphql-queries) for additional information on the GraphQL endpoint.

## Endpoints

### `moonlightHistory`

Retrieves emitted events from transactions based on sender and/or receiver.  The `moonlightHistory' endpoint allows you to specify block ranges (fromBlock, toBlock) to retrieve all transfers within the specified block range. You can also specify a maxCount and a pageCount to limit the number of results returned. Pagination should be used with care as it is offset-based and **not** cursor-based.

#### Example Queries

##### Query by Sender

> If only **sender** is specified, it will only show moonlight outflows for that address.

```graphql
query {
    moonlightHistory(sender: "<sender_address>") {
        json
    }
}
```

**cURL Command:**

```sh
curl -X POST \
  -H "Content-Type: application/json" \
  --data '{"query": "query { moonlightHistory(sender: \"<sender_address>\") { json } }"}' \
  https://nodes.dusk.network/on/graphql/query
```

##### Query by Receiver

> If only **receiver** is specified, it will only show moonlight inflows for that address.

```graphql
query {
    moonlightHistory(receiver: "<receiver_address>") {
        json
    }
}
```

**cURL Command:**

```sh
curl -X POST \
  -H "Content-Type: application/json" \
  --data '{"query": "query { moonlightHistory(receiver: \"<receiver_address>\") { json } }"}' \
  https://nodes.dusk.network/on/graphql/query
```



##### Query by Sender and Receiver

> If **both sender and receiver** are specified, it will **only** return events from transactions where an outflow occured on the sender's side and an inflow occured on the receiver's side within the same transaction.

```graphql
query {
    moonlightHistory(
        sender: "<sender_address>"
        receiver: "<receiver_address>"
    ) {
        json
    }
}
```

**cURL Command:**

```sh
curl -X POST \
  -H "Content-Type: application/json" \
  --data '{"query": "query { moonlightHistory(sender: \"<sender_address>\", receiver: \"<receiver_address>\") { json } }"}' \
  https://nodes.dusk.network/on/graphql/query
```

### `fullMoonlightHistory`

Returns all transactions that have an inflow or outflow of public Dusk for the given address, without the granular filtering options available in `moonlightHistory`. The `fullMoonlightHistory' endpoint allows you to specify block ranges (fromBlock, toBlock) to retrieve all transfers within the specified block range.

#### Example Query

```graphql
query {
    fullMoonlightHistory(address: "<address>") {
        json
    }
}
```

**cURL Command:**

```sh
curl -X POST \
  -H "Content-Type: application/json" \
  --data '{"query": "query { fullMoonlightHistory(address: \"<address>\") { json } }"}' \
  https://nodes.dusk.network/on/graphql/query
```

## Filtering

### Filtering for public transactions

There is a distinction between a **protocol transaction** and a **transfer of value**:

- Transactions can be of type `moonlight`, but some transactions can also be of type `phoenix` and they can still lead to a change in the public balance of an account, while not being a public (moonlight) transaction (E.g., in the case of a conversion from shielded dusk **to** public dusk).
- If you only want to see public transactions, you can filter the JSON response for transaction entries where at least one event contains the following fields:
  ```json
  "target": "0100000000000000000000000000000000000000000000000000000000000000",
  "topic": "moonlight"
  ```

Example JavaScript, Rust, Bash function to filter based on it:

#### JavaScript

```javascript
function filterMoonlightTransactions(response) {
    return response.moonlightHistory.json.filter(tx =>
        tx.events.some(event =>
            event.target === "0100000000000000000000000000000000000000000000000000000000000000" &&
            event.topic === "moonlight"
        )
    );
}
```

#### Rust

```rust
use serde_json::Value;

fn filter_moonlight_transactions(response: &Value) -> Vec<&Value> {
    response["moonlightHistory"]["json"].as_array().unwrap_or(&vec![]).iter()
        .filter(|tx| tx["events"].as_array().unwrap_or(&vec![]).iter()
            .any(|event| event["target"] == "0100000000000000000000000000000000000000000000000000000000000000"
                && event["topic"] == "moonlight"))
        .collect()
}
```

#### Bash
>  using jq
```sh
jq '.moonlightHistory.json | map(select(.events | any(.target == "0100000000000000000000000000000000000000000000000000000000000000" and .topic == "moonlight")))'
```

**cURL Command with Filtering:**

```sh
curl -X POST \
  -H "Content-Type: application/json" \
  --data '{"query": "query { moonlightHistory(address: \"<address>\") { json } }"}' \
  https://nodes.dusk.network/on/graphql/query | jq '.moonlightHistory.json | map(select(.events | any(.target == "0100000000000000000000000000000000000000000000000000000000000000" and .topic == "moonlight")))'
```

This ensures that only public protocol transactions are retrieved.

### Filtering for public transaction & plain standard transfer

To retrieve only **standard** Moonlight transfers (i.e., transactions that involve a direct value transfer without additional actions, such as contract calls), you can filter for transactions where the events array contains exactly one entry.

The entry we are looking for is a `MoonlightTransactionEvent`, which is the same as the one above, but it will be the only event emitted during that transaction. So the only additional constraint is that events have only one entry.

#### Example Bash
```sh
jq '.moonlightHistory.json | map(select(.events | length == 1 and any(.target == "0100000000000000000000000000000000000000000000000000000000000000" and .topic == "moonlight")))'
```

**cURL Command with Filtering:**

```sh
curl -X POST \
  -H "Content-Type: application/json" \
  --data '{"query": "query { moonlightHistory(address: \"<address>\") { json } }"}' \
  https://nodes.dusk.network/on/graphql/query | jq '.moonlightHistory.json | map(select(.events | length == 1 and any(.target == "0100000000000000000000000000000000000000000000000000000000000000" and .topic == "moonlight")))'
```
