---
title: Transaction fees and gas
description: Explanation of the fees and gas mechanisms in Dusk.
---

In the context of the Dusk and its economic protocol, _gas_ is a fundamental concept central to the execution and processing of transactions on the blockchain. Gas can be thought of as the fuel that powers blockchain operations, similar to how gasoline powers a vehicle.

## Gas as Resource Allocation Meter

Gas is used as a unit of measure to allocate resources on the blockchain. Each operation, whether it's a simple transaction or a complex smart contract execution, requires a certain amount of computational power and storage. Executing transactions and smart contract functions via transactions involves computational work performed by the network nodes. The unit of measurement used to quantify the computational effort required for executing operations on a blockchain is called gas. 

Gas quantifies the resource usage and measures the amount of work needed to perform a task: the more complex the task, the more gas it requires. 

## Gas Price

While gas itself measures computation, the gas price determines the amount of native cryptocurrency you are willing to pay per unit of gas. Gas pricing serves as a mechanism to prevent spam and misuse of the network but also finances the validators through the transaction fees. Smart contracts also consume gas while performing executions, which are paid for by the user. It therefore makes sense for developers to optimize for gas consumption so that end-users do not overpay for contract interactions. It discourages actors from overloading the network with excessive or inefficient operations.

Gas prices fluctuate based on network demand. When the network is congested, gas prices can spike, making transactions more expensive. Conversely, in periods where the network is less congested, gas prices are lower. Dusk is well equipped to maintain more than 100 transactions per second and therefore allows for a steady and low gas price, resulting in extremely low transaction fees for users using the chain.

Whenever you use a unit of gas, a corresponding price is incurred. The gas price is expressed in `LUX` (`LUX` being the minimum fraction of `DUSK`, equivalent to 1 billionth of `DUSK`).

## Transaction Fee

When you initiate a transaction, you specify the fee you're willing to pay. The fee is calculated by indicating the maximum amount of gas you're willing to use and the amount of `LUX` you'll pay for each gas unit.

For example, if you send a transaction with GasLimit=100,000 and GasPrice=2, it means you'll pay no more than 100,000 * 2 `LUX` = 0.000200 `DUSK` for that transaction. This only signifies your fee limit, as only the spent gas is charged after your transaction is processed and included in a block. This means that if the transaction consumes only 50,000 GasPoints, you'll be charged only 0.0001 `DUSK`.

If the provided GasLimit is not sufficient for processing, your transaction may encounter an `OUT_OF_GAS` error, leading to two scenarios:
1. **`OUT_OF_GAS` while spending**: Your transaction is simply discarded by the block producer.
2. **`OUT_OF_GAS` while calling a smart contract**: Your transaction is included in a block with a "FAIL" status. This means that any changes made during the execution of the smart contract up to the exhaustion of gas are reverted. Additionally, all fees are charged.

## Unsuccessful Transactions
In addition to encountering the `OUT_OF_GAS` error, a transaction can also FAIL for various reasons depending on the invoked smart contract. If the transaction fails, all changes are reverted, and the entire fees associated with the transaction are charged.

## Fee Redistribution Mechanism
All transaction fees collected during block production contribute to the block reward, which includes:
- Transaction fees.
- Coinbase value based on the [token emission schedule](/learn/tokenomics#token-emission-schedule).

The block reward is then distributed as follows:

- **80%** to the block generator
- **10%** to the voting committee
- **10%** to the DUSK pool (used for network development and operational expenses)

### Block Generator’s Reward Breakdown

The block generator’s 80% reward is split into:

- **Fixed Portion** (70%): Guaranteed for producing the block.
- **Variable Portion** (10%): Determined by the number of votes included in the block certificate.

The more votes included, the larger the reward. If all votes are included, the generator receives the full 80%.
This incentivizes block generators to include as many votes as possible, ensuring network consensus and security.

### Voting Committee Rewards

The voting committee receives 10% of the block reward, distributed proportionally based on the credits held by each voter in the committee. Voters with more credits receive larger rewards, encouraging their active participation and discouraging them from skipping votes.
