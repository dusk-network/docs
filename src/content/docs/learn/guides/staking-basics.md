---
title: Staking on Dusk
description: Discover how to earn rewards by staking on Dusk.
---

Staking is a vital component of Dusk, ensuring decentralization and security.
By staking your DUSK, you contribute to the network's integrity and consensus mechanism, enabling efficient and secure transaction validation. Staking is a way for everyone to actively support the network while earning rewards for their participation.

## Why Stake?

Staking DUSK allows you to:

- Earn rewards and grow your holdings.
- Participate in consensus and increase the security of Dusk.

## What do you need to start?
To begin staking, you need:

- At least **1000 DUSK**: this is the minimum amount required to participate.
- A **running and fully-synced node**: you can learn how to run a node [here](/operator/provisioner/)
- **Time for maturity**: your stake becomes active after 2 epochs (about **4320 blocks**).


:::note[Important]
After having staked your tokens, **it takes some time before you start earning rewards**. This is because your stake becomes active after the maturity period (4320 blocks). The maturity period of 4320 blocks corresponds to **approximately 12 hours** (based on an average block time of 10 seconds). Before expecting rewards, ensure to account for this waiting period.
:::


## How are Rewards determined?

Rewards are probabilistically allocated based on your node's participation in the network's consensus process.

**Once** your stake is active, you start earn rewards, which come from:

- Your node proposing a block.
- Your node voting on a block.
- Token emissions as outlined in the [tokenomics](/learn/tokenomics#token-emission) page.

Your **rewards depend on the size of your stake relative to the total network stake**. Larger stakes increase your likelihood of being selected to propose or validate blocks, leading to more frequent rewards. Conversely, smaller stakes may experience longer intervals between rewards.

You can learn more on how the Succinct Attestation consensus works [here](/learn/deep-dive/succinct-attestation).

:::note[Important]
The more DUSK you stake, the more likely you are to earn rewards as an active participant in the network.
:::

## Slashing

Dusk uses a [slashing mechanism](/learn/deep-dive/slashing) to maintain network security. If your node submits invalid blocks or goes offline, your stake may be partially reduced. This mechanism ensures the network rewards reliable participants and discourages harmful behavior.

:::note[Important]
To prevent slashing, ensure your node is operational and synced before staking.
:::

## Re-stake Rewards & Increase Stake
You can increase your stake at any time without needing to unstake first. When you do, **90% of the added amount becomes active immediately** and begins accruing rewards, while the remaining **10% is moved to your inactive stake**. However, if your stake is not active yet, no penalties are applied, and the full added amount will be available as soon as the original stake becomes eligible.

The inactive portion does not generate rewards and remains locked. It can only be accessed by **fully unstaking** your holdings. Withdrawn rewards are available immediately and can be restaked if you choose. Any new staked amount is directly eligible (without the need of waiting for the maturity period), except for the 10% inactive portion (which will never become eligible).

:::note[Important]
When you increase your stake, keep in mind that:
- **90%** is added to your active stake and starts earning rewards.
- **10%** goes to your inactive stake, accessible only if you **fully** unstake.
- This applies only if the stake is **already** eligible.
:::

This mechanism promotes fairness and prevents potential exploitation of compounding effects, ensuring a balanced staking system.

### Example
As an example, suppose you stake 110,000 DUSK:
- Your active stake becomes 99,000 DUSK (90% of the total).
- 11,000 DUSK (10%) is held in the inactive stake.

If you later withdraw 98,000 DUSK, leaving 1,000 DUSK staked:
- You immediately have 98,000 DUSK, fully liquid.
- You still have 1,000 DUSK actively staking and 11,000 DUSK in the inactive stake.
- Once you fully unstake the remaining 1,000 DUSK, the 11,000 DUSK held in the inactive stake is unlocked and becomes available again.


## Ready to Stake?

Staking is a great way to earn rewards and participate in Dusk’s ecosystem.

Staking not only benefits you through rewards but also strengthens the Dusk network’s security and decentralization.

Start staking now using the [web wallet](https://apps.dusk.network/wallet/setup/)!
