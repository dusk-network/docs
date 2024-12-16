---
title: Transaction Lifecycle
description: The lifecycle of a transaction on Dusk from creation to finalization
---
:::note[General rule]
Transactions become immutable and are ultimately permanently recorded on the blockchain once a transaction is executed and the block reaches finality.
:::

## Steps executed during a transaction for Dusk


Transactions on Dusk follow a specific lifecycle. Here's a basic overview:

1. **Transaction creation**: The process begins when a wallet or similar software generates a new transaction.
2. **Transaction broadcasting**: The transaction is sent out to the Dusk network and broadcast within it.
3. **Transaction reaches Mempool**: The transaction enters the mempool, awaiting validation (transaction included event).
4. **Transaction validation**: The transaction is removed from the mempool and executed (transaction removed event).
5. **Transaction execution**: The transaction is executed (transaction executed event).
   - **Successful Transaction**: No errors available
   - **Reverted or Failed Transaction**: Errors available (transaction executed event with error field available). This is contract-specific and indicates a revert (panic) or other error that was returned.
6. **Block acceptance**: The block containing the transaction is accepted into the blockchain (block accepted event).
7. **Block confirmation**: The block is confirmed when another block is accepted (block state-change event with state changed to `confirmed`).
8. **Block finalization**: The block reaches finality, there is nothing more to do and the transaction is completed & finalized. (block state-change event with state changed to `finalized`).

:::note[Failed Transactions]
Failed transactions are defined here as a concept at the contract level. We assume that each contract, just like the transfer contract or other genesis contracts, makes use of proper error handling and panics:

- If a contract panics, the transaction is reverted and there will be an error to look at.
- If a contract returns a result that contains an error, there will also be an error to look at.

Both of these are **contract specific**, the chain still executed the transaction successfully - according to the code of the smart contract.

A failed or reversed transaction has nothing to do with Dusk itself directly. The transaction was successfully executed according to Dusk's rules and recorded on the blockchain, hence the transaction executed event.
:::

:::caution[Reverted Blocks]
Before reaching finality, blocks sometimes revert according to consensus rules.

This can happen during steps **6** and **7**, (block reverted event). In such cases, you need to re-listen for transaction events to get the required information.
:::

### Checking transaction status
> This applies to all genesis contracts and any future third party contracts that use proper error handling and panics.
- **Successful Transaction**: Check for the combination of a successful transaction executed event (with error `None`) **and** the finalized block event.
  - `transaction executed` event with no errors and `block statechange` `finalized` event.
- **Reverted & Failed Transactions**: Check the transaction executed event for errors.
  - `transaction executed` event with error field available.
- **Reverted Block**: If a block is reverted, re-listen for the transaction events and the new block.
  - `block reverted` event and re-evaluate the transaction status.

:::tip[Info]
For information about events you can look at the [Rusk Universal Event System (RUES)](/developer/integrations/rues) page
:::

### Practical considerations for listening to transactions
For example for handling Dusk deposits with Moonlight:
- Monitor the transaction executed event and ensure no errors.
   - Check for relevant contract specific events like `MoonlightTransactionEvent`
- Confirm that the block containing the transaction is finalized.
- Handle block reverts by re-listening for transaction events.

By following these guidelines, you can ensure accurate tracking of transactions on the Dusk blockchain.

### Deep dive: Discarded transactions

This is nothing to be concerned about and can be ignored if you are running official wallet software or using the official SDKs (eg. w3sper).

A transaction is rarely discarded in **two** cases:
- Invalid to protocol specifications (payload incomplete, corrupted, wrong)
- Gas limit is below the protocol minimum gas limit

Such invalid transactions are also caught by pre-verifications on multiple steps both in the wallet and later on the node.

To achieve this, one must actively use a modified or incorrectly implemented wallet software or SDK. Such transactions can be compared to invalid data packets on a port that are simply ignored because the listening application has no use for them.

