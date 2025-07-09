---
title: Tokenomics 
description: Overview of Dusk’s tokenomics, allocation, vesting schedules, and incentives.


---

The Dusk protocol utilizes the DUSK token both as an incentive for consensus participation and as its primary native currency. DUSK is currently represented as an ERC20 or BEP20 token. Since mainnet is now live, users are able to [migrate tokens to native DUSK](/learn/guides/mainnet-migration) via a burner contract.

This page provides an in-depth overview of the DUSK token’s metrics, utility, allocation, emission schedule, rewards, as well as insights from the <a href="https://github.com/dusk-network/audits/blob/main/core-audits/2024-09_protocol-security-review_oak-security.pdf">Economic Protocol Design</a> report.

## Token Metrics

- **Token Name**: Dusk
- **Token Symbol**: DUSK
- **Initial Supply**: 500,000,000 DUSK, comprising both ERC20, BEP20. These are migrated to native DUSK tokens using a burner contract.
- **Total Emitted Supply**: 500,000,000 DUSK will be emitted over 36 years to reward stakers on the mainnet, following the [Token Emission Schedule](#token-emission-schedule).
- **Maximum Supply**: 1,000,000,000 DUSK, combining the 500M initial supply and 500M emitted over time.
- **Circulating Supply**: Available on [this page](https://supply.dusk.network/). The circulating supply reflects the initial supply minus the DUSK held by the [Dusk deployer](https://etherscan.io/token/0x940a2db1b7008b6c776d4faaca729d6d4a4aa551?a=0x618bb3b255928ae6b2046df5c828fa1dc7e3c5f0). 
* **ICO**: Raised \$8 million in November 2018, with tokens priced at $0.0404. Private sale tokens account for 50% of the total supply, split between 10% DUSK BEP20 and 40% DUSK ERC20.

## Token Contract

The DUSK token is available as an ERC20 on Ethereum and a BEP20 on Binance Smart Chain.

| Chain                | Standard | Contract Address                           |
|----------------------|----------|--------------------------------------------|
| Ethereum             | ERC20    | [0x940a2db1b7008b6c776d4faaca729d6d4a4aa551](https://etherscan.io/token/0x940a2db1b7008b6c776d4faaca729d6d4a4aa551) |
| Binance Smart Chain  | BEP20    | [0xb2bd0749dbe21f623d9baba856d3b0f0e1bfec9c](https://bscscan.com/token/0xb2bd0749dbe21f623d9baba856d3b0f0e1bfec9c) |

## Token Markets & Exchanges

The DUSK token is widely accessible on top-tier CEXs and DEXs. For more information on the various locations DUSK is accessible, see the markets pages for Coinmarketcap and Coingecko:
- [DUSK markets Coinmarketcap](https://coinmarketcap.com/currencies/dusk/#Markets)
- [DUSK markets Coingecko](https://www.coingecko.com/en/coins/dusk)

## Token Utility

DUSK serves several key purposes within the ecosystem:
* Used for staking in consensus participation.
* Rewards to consensus participants.
* Payment of network fees ([gas](/learn/deep-dive/tx-fees)).
* Paying for the deployment of dApps on the network.
* Payment of services on the network.

### DUSK for Transaction Fees

DUSK represents the only medium responsible for transaction fee payments. Each transaction requires to have an attached fee. The transaction fees exist to subsidize consensus participants for the computation costs as well as to act as a deterrent against DDoS attacks. Specifically, Dusk utilizes an internal accounting system to express the cost of operations inside the virtual machine called `gas`. 

Users wishing to add their transaction to a block enter a *generalized first-price auction (GFP)* by setting a gas price (i.e. `gasprice`) they are willing to pay per unit of gas. The block has a gas limit, and transactions consume the available gas based on the auction results.
The `baseprice` is the minimum gas price that can be set for a transaction. The `gaslimit` is required as a workaround to the halting problem, ensuring that every transaction does halt at after a finite amount computation cycles, either due to the successful termination or due to the gas consumption reaching the allocated.

Dusk is also working on innovative gas payment mechanisms to further improve the tokenomics and user experience, while integrating seamlessly with business requirements. As such, Dusk improves over the usual gas management in blockchain by introducing possibilities that are unavailable in other networks. More information can be found on the [economic model page](/learn/deep-dive/economic-protocol).

## Token Allocation and Vesting Overview

The vesting period ran from May 2019 to April 2022.

| Allocation Category | Percentage | DUSK Tokens   | Vested        |
|---------------------|------------|---------------|---------------|
| Token Sale          | 50%        | 250,000,000   | 250,000,000   |
| Team                | 6.4%       | 32,000,000    | 32,000,000    |
| Advisors            | 6.4%       | 32,000,000    | 32,000,000    |
| Development         | 18.1%      | 90,500,000    | 90,500,000    |
| Exchange            | 11.8%      | 59,000,000    | 59,000,000    |
| Marketing           | 7.3%       | 36,500,000    | 36,500,000    |
| **Total**           | **100%**   | **500,000,000** | **500,000,000** |

## Staking Details

Staking is a crucial aspect of the Dusk protocol, allowing token holders to contribute to network security. For more details on the emission schedule, see the **[Token Emission Schedule](/learn/tokenomics#token-emission-schedule)** below. Here are the primary details for staking DUSK tokens:

* **Minimum Staking Amount**: 1000 DUSK.
* **Maximum Staking Amount**: No upper bound.
* **Stake Maturity Period**: 2 Epochs - 4320 blocks.
* **Unstaking**: No penalties or waiting period.

## Token Emission Schedule

The DUSK token emission schedule plays a vital role in incentivizing network participants, particularly in the early stages of the blockchain network, where transaction fees alone may not be sufficient to reward node operators and validators. By systematically emitting tokens over time, the Dusk network ensures that participants are adequately compensated for securing and maintaining the network, fostering its growth and decentralization.

The token emission has been designed to align with the long-term vision of building a robust and enduring ecosystem, while controlling inflation and limiting potential attack vectors. The emission schedule follows a carefully structured geometric decay model, wherein the number of emitted tokens reduces systematically every 4 years. This approach balances the need for continuous token issuance with inflation control, ensuring long-term sustainability and stability for the DUSK token economy.

Key aspects of the DUSK token emission schedule include:

- **36-Year Emission Duration**: The token emission is distributed across 36 years, divided into 9 periods of 4 years each.
- **Emission Reduction Every 4 Years**: Token emission decreases every 4 years by a fixed reduction rate, ensuring gradual reduction in token issuance, similar to Bitcoin’s halving model.

## Token Emission

The emission rate starts with a reduction rate `r = 0.5`, meaning the token emission halves every 4 years. This strategy is designed to rapidly build network participation by providing strong early incentives.

| Period (Years)     | Period Duration (Blocks) | Total Emission (DUSK) | Total Supply (Cumulative) | Emission Per Block | Reduction Rate (r) |
|--------------------|--------------------------|-----------------------|---------------------------|--------------------|--------------------|
| 1 (0-4)            | 12,614,400               | 250.48M               | 250.48M                   | 19.8574 DUSK/block | N/A                |
| 2 (4-8)            | 12,614,400               | 125.24M               | 375.72M                   | 9.9287 DUSK/block  | 0.5                |
| 3 (8-12)           | 12,614,400               | 62.62M                | 438.34M                   | 4.9644 DUSK/block  | 0.5                |
| 4 (12-16)          | 12,614,400               | 31.31M                | 469.65M                   | 2.4822 DUSK/block  | 0.5                |
| 5 (16-20)          | 12,614,400               | 15.65M                | 485.30M                   | 1.2411 DUSK/block  | 0.5                |
| 6 (20-24)          | 12,614,400               | 7.83M                 | 493.13M                   | 0.6206 DUSK/block  | 0.5                |
| 7 (24-28)          | 12,614,400               | 3.91M                 | 497.04M                   | 0.3103 DUSK/block  | 0.5                |
| 8 (28-32)          | 12,614,400               | 1.95M                 | 498.99M                   | 0.1551 DUSK/block  | 0.5                |
| 9 (32-36)          | 12,614,400               | 0.98M                 | 499.97M                   | 0.0776 DUSK/block  | 0.5                |

More information regarding the model can be found in the
<a href="https://github.com/dusk-network/audits/blob/main/core-audits/2024-09_protocol-security-review_oak-security.pdf">Economic Protocol Design</a> report.

## Incentive Structure

To ensure network security, economic sustainability, and consensus efficiency, the following reward distribution structure is applied:

- **70%** to the Block Generator (proposal step) and an extra **10%** depending on the
credits included in the certificate. Any undistributed rewards from this 10% are burned as part of the gas-burning mechanism.
- **10%** to the Dusk Development Fund
- **5%** to the Validation Committee (validation step)
- **5%** to the Ratification Committee (ratification step)

This structure incentivizes all steps of the [SA Consensus](/learn/deep-dive/succinct-attestation), with a focus on the Block Generator, which plays the most critical role.

The Block Generator is encouraged to include as many voters in the certificate as possible, as the percentage of the total reward it receive also depends on the number of votes obtained in the Validation and Ratification steps.
