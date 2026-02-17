---
title: Legacy Guides (Archived)
description: Legacy programs and guides kept for transparency. These flows are no longer active.
---

This page collects legacy programs and guides that are no longer active.

If you’re looking to move ERC20/BEP20 DUSK to native DUSK today, use: [ERC20/BEP20 Migration](/learn/guides/mainnet-migration/).

## Mainnet Genesis On-Ramp (Ended)

The mainnet genesis on-ramp is closed. These links are kept for reference:

- ERC20 on-ramp contract (Ethereum): <a href="https://etherscan.io/address/0x8787BbE53920B33411F7C9A91Ac321AF1ea1aa2d" target="_blank" rel="noreferrer">0x8787BbE53920B33411F7C9A91Ac321AF1ea1aa2d</a>
- BEP20 on-ramp contract (BSC): <a href="https://bscscan.com/address/0x3886ab688febff60ce21e99251035f8e29abca31" target="_blank" rel="noreferrer">0x3886ab688febff60ce21e99251035f8e29abca31</a>

Genesis on-ramp state snapshots:

- ERC20 snapshot: <a href="https://raw.githubusercontent.com/dusk-network/dusk-migration/refs/heads/genesis-state/genesis-state-eth.toml" target="_blank" rel="noreferrer">genesis-state-eth.toml</a>
- BEP20 snapshot: <a href="https://raw.githubusercontent.com/dusk-network/dusk-migration/refs/heads/genesis-state/genesis-state-bsc.toml" target="_blank" rel="noreferrer">genesis-state-bsc.toml</a>

## BEP2 -> BEP20 Migration (Ended)

The BEP2 to BEP20 DUSK migration concluded on **November 1, 2024**. The migration address is no longer active:

`bnb1dfls6c8y39l7qq4gj2479wkehg85pt5m07y94g`

## Withdraw Staked ERC20 DUSK (ITN2, Legacy)

This only applies if you staked ERC20 DUSK via the ITN2 staking portal (pre-mainnet).

1. Open the staking contract on Etherscan and connect the same wallet address you used to stake:
   <a href="https://etherscan.io/address/0x4ab6ffa52460979dde1e442fb95f8bac56c3adc3" target="_blank" rel="noreferrer">0x4ab6ffa52460979dde1e442fb95f8bac56c3adc3</a>
2. In **Read Contract**, call `balanceOf(address)` to find your staked amount.
3. In **Write Contract**, call `withdraw(amount)` with that exact amount.

If you need help recovering funds, ask in the Dusk Discord: <a href="https://discord.gg/dusk-official" target="_blank" rel="noreferrer">discord.gg/dusk-official</a>.
