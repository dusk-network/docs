---
title: Tokenomics
description: DUSK token utility, supply, emissions, and staking incentives.
---

DUSK is the native token used for transaction fees (gas) and staking on the Dusk network.

If you hold ERC20/BEP20 DUSK (on Ethereum/BSC), follow the [mainnet migration guide](/learn/guides/mainnet-migration) to move to native DUSK.

For economic model rationale and assumptions, see the <a href="https://github.com/dusk-network/audits/blob/main/core-audits/2024-09_protocol-security-review_oak-security.pdf" target="_blank" rel="noreferrer">Economic Protocol Design</a> report.

## Quick facts

- **Symbol**: DUSK
- **Decimals (native DUSK)**: 9 (`1 DUSK = 1,000,000,000 LUX`)
- **Decimals (ERC20/BEP20 DUSK)**: 18 (see [migration guide](/learn/guides/mainnet-migration))
- **Supply model**: 500,000,000 initial + 500,000,000 emitted over time (max 1,000,000,000)
- **Live supply**: see [supply.dusk.network](https://supply.dusk.network/)

## What DUSK is used for

- **Gas**: pay for transactions and on-chain execution.
- **Staking**: secure the network and earn rewards.

## Fees and gas

Every transaction consumes **gas** (a unit of work). Fees are paid in `DUSK`.

- You set a **gas limit** and a **gas price** (in `LUX`).
- The fee paid is `gas_used * gas_price`.
- Unused gas is not charged.
- If a transaction runs out of gas, it reverts, but the gas spent is still paid.

Collected fees are part of the **block reward** and are redistributed (see [Incentives](#incentives)).

## Staking parameters

For the user-facing flow, see [Staking on Dusk](/learn/guides/staking-basics).

- **Minimum stake**: 1,000 DUSK
- **Maximum stake**: no upper bound
- **Maturity**: 2 epochs (4,320 blocks)
- **Unstaking**: no penalties or waiting period
- **Adding to stake (top-ups)**: see [Adding to an existing stake](/learn/guides/staking-basics#adding-to-an-existing-stake)

## Incentives

Each block has a **block reward** consisting of:

- newly emitted DUSK (see [Token emission](#token-emission)), and
- all transaction fees paid in that block.

Reward distribution:

- **Block generator**: 70% + up to an extra 10% (based on credits included in the certificate; any undistributed portion is burned)
- **Development fund**: 10%
- **Validation committee**: 5%
- **Ratification committee**: 5%

## Token emission

The network emits a total of **500,000,000 DUSK** over **36 years** to fund staking rewards.
Emissions follow a geometric decay model with reduction rate `r = 0.5` (halving every 4 years).

<details>
<summary><strong>Emission schedule (by period)</strong></summary>

| Period (Years) | Period Duration (Blocks) | Total Emission (DUSK) | Total Supply (Cumulative) | Emission Per Block | Reduction Rate (r) |
|---|---:|---:|---:|---:|---:|
| 1 (0-4) | 12,614,400 | 250.48M | 250.48M | 19.8574 | N/A |
| 2 (4-8) | 12,614,400 | 125.24M | 375.72M | 9.9287 | 0.5 |
| 3 (8-12) | 12,614,400 | 62.62M | 438.34M | 4.9644 | 0.5 |
| 4 (12-16) | 12,614,400 | 31.31M | 469.65M | 2.4822 | 0.5 |
| 5 (16-20) | 12,614,400 | 15.65M | 485.30M | 1.2411 | 0.5 |
| 6 (20-24) | 12,614,400 | 7.83M | 493.13M | 0.6206 | 0.5 |
| 7 (24-28) | 12,614,400 | 3.91M | 497.04M | 0.3103 | 0.5 |
| 8 (28-32) | 12,614,400 | 1.95M | 498.99M | 0.1551 | 0.5 |
| 9 (32-36) | 12,614,400 | 0.98M | 499.97M | 0.0776 | 0.5 |

</details>

## Slashing

Dusk uses **soft slashing** to discourage repeated faults and long downtime.
Soft slashing does not burn stake; it reduces a provisioner's effective participation and rewards.

- **Suspension**: stake is suspended for one or more epochs (not eligible for selection; earns no rewards).
- **Penalization**: a portion of stake is moved to the claimable rewards pool, reducing effective stake used in sortition.

In practice: run official software, keep it updated and online, and monitor missed duties.

## Token versions and contracts

Native DUSK is the mainnet token.
ERC20 and BEP20 DUSK exist on other chains for migration and bridging.

| Chain | Standard | Contract address |
|---|---|---|
| Ethereum | ERC20 | [0x940a2db1b7008b6c776d4faaca729d6d4a4aa551](https://etherscan.io/token/0x940a2db1b7008b6c776d4faaca729d6d4a4aa551) |
| BSC | BEP20 | [0xb2bd0749dbe21f623d9baba856d3b0f0e1bfec9c](https://bscscan.com/token/0xb2bd0749dbe21f623d9baba856d3b0f0e1bfec9c) |

## Markets

For up-to-date markets and trading venues, see:

- [CoinMarketCap markets](https://coinmarketcap.com/currencies/dusk/#Markets)
- [CoinGecko markets](https://www.coingecko.com/en/coins/dusk)

## Historical allocation (initial supply)

The vesting period ran from May 2019 to April 2022.

<details>
<summary><strong>Allocation and vesting table</strong></summary>

| Allocation Category | Percentage | DUSK Tokens | Vested |
|---|---:|---:|---:|
| Token Sale | 50% | 250,000,000 | 250,000,000 |
| Team | 6.4% | 32,000,000 | 32,000,000 |
| Advisors | 6.4% | 32,000,000 | 32,000,000 |
| Development | 18.1% | 90,500,000 | 90,500,000 |
| Exchange | 11.8% | 59,000,000 | 59,000,000 |
| Marketing | 7.3% | 36,500,000 | 36,500,000 |
| Total | 100% | 500,000,000 | 500,000,000 |

</details>
