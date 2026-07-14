---
title: Scan Moonlight deposits
description: Detect finalized public DUSK deposits with archive GraphQL and W3sper.
---

Use an archive-enabled Rusk node to scan public Moonlight deposits. The Moonlight history indexes are updated only when blocks finalize, so their results do not require a separate confirmation delay.

The public endpoints are useful for development. Run an archive node you control for production ingestion, availability, and reproducible backfills.

## Choose a query

| Query | Returns |
|---|---|
| `moonlightHistory(receiver: ...)` | Finalized transactions that caused an inflow to one public account, with optional block bounds and offset pagination |
| `fullMoonlightHistory(address: ...)` | Finalized inflows and outflows affecting one public account |
| `transactionsByMemo(memo: ...)` | Finalized indexed transactions carrying an exact memo |

History can include direct transfers, contract payouts, refunds, staking withdrawals, and Phoenix-to-Moonlight conversions. A direct Moonlight deposit is specifically a non-reverted transfer-contract event with topic `moonlight`, the expected receiver, and a positive value.

Do not identify direct transfers by counting events. A transaction can emit additional contract events without changing its transaction family.

## W3sper scanner

Install W3sper:

```bash
deno add jsr:@dusk/w3sper
```

Create `scan-deposits.js`:

```js
import { Network } from "@dusk/w3sper";

const TRANSFER_CONTRACT =
  "0100000000000000000000000000000000000000000000000000000000000000";

const account = Deno.env.get("MOONLIGHT_ACCOUNT");
if (!account) throw new Error("Set MOONLIGHT_ACCOUNT");
if (!/^[1-9A-HJ-NP-Za-km-z]+$/.test(account)) {
  throw new Error("MOONLIGHT_ACCOUNT must be Base58");
}

const nodeUrl = Deno.env.get("DUSK_NODE") ?? "https://nodes.dusk.network";
const startHeight = Number(Deno.env.get("FROM_BLOCK") ?? "0");
const batchSize = Number(Deno.env.get("BLOCK_BATCH_SIZE") ?? "1000");

if (!Number.isSafeInteger(startHeight) || startHeight < 0) {
  throw new Error("FROM_BLOCK must be a non-negative integer");
}
if (!Number.isSafeInteger(batchSize) || batchSize < 1) {
  throw new Error("BLOCK_BATCH_SIZE must be a positive integer");
}

const network = await Network.connect(nodeUrl);

try {
  const status = await network.query("lastBlockPair { json }");
  const finalizedHeight = status.lastBlockPair.json.last_finalized_block[0];

  for (
    let fromBlock = startHeight;
    fromBlock <= finalizedHeight;
    fromBlock += batchSize
  ) {
    const toBlock = Math.min(
      fromBlock + batchSize - 1,
      finalizedHeight,
    );
    const result = await network.query(`
      moonlightHistory(
        receiver: "${account}"
        fromBlock: ${fromBlock}
        toBlock: ${toBlock}
      ) {
        json
      }
    `);

    const deposits = (result.moonlightHistory?.json ?? []).flatMap((group) =>
      group.events
        .filter((event) =>
          event.target === TRANSFER_CONTRACT &&
          event.topic === "moonlight" &&
          event.reverted === false &&
          event.data?.receiver === account &&
          BigInt(event.data?.value ?? "0") > 0n
        )
        .map((event) => ({
          txId: group.origin,
          blockHeight: group.block_height,
          amountLux: event.data.value,
          memoHex: event.data.memo || null,
        }))
    );

    console.log(JSON.stringify({ fromBlock, toBlock, deposits }));
  }
} finally {
  await network.disconnect();
}
```

Run it from the first unprocessed block:

```bash
MOONLIGHT_ACCOUNT='<PUBLIC_ACCOUNT>' \
FROM_BLOCK='<NEXT_BLOCK>' \
deno run --allow-env --allow-net scan-deposits.js
```

Amounts are integer LUX strings: `1 DUSK = 1_000_000_000 LUX`. Memos are returned as hex and are untrusted routing data; validate their decoded format before mapping them to a customer.

## Persist safely

For each completed block range, use one database transaction to:

1. Insert credits with a unique constraint on the Dusk transaction ID.
2. Record unknown or invalid destination metadata for manual review instead of dropping it.
3. Advance the account's `next_block` checkpoint to `toBlock + 1`.
4. Commit only after all credits in the range are durable.

After a crash, restart from `next_block`. Re-scanning a range is safe when transaction IDs are unique. Never advance the checkpoint before writing its deposits, and never use a memo as the idempotency key.

Use bounded block ranges instead of deep offset pagination. This keeps backfills predictable while new finalized blocks are added.

## Other public inflows

The scanner intentionally accepts only direct Moonlight transfers. If your integration also accepts contract payouts, staking withdrawals, refunds, or Phoenix conversions, define and test a separate rule for each relevant transfer-contract event such as `contract_to_account`, `mint`, `withdraw`, or `convert`.

See [Transaction lifecycle](/developer/integrations/tx-lifecycle/) for live mempool and finality behavior, and [HTTP API](/developer/integrations/http-api/#graphql-queries) for raw GraphQL access.
