---
title: Staking on Dusk
description: How staking works on Dusk, what you need, and what to expect from rewards and maturity.
---

Staking is how Dusk selects provisioners (validator nodes) to propose and validate blocks.
Stakers earn rewards funded by token emissions and transaction fees.

## Why stake?

Staking DUSK allows you to:

- Earn staking rewards.
- Help secure the network by participating in consensus.

## Two ways to stake

### 1) Direct staking (run a provisioner)

To earn protocol staking rewards directly, you run a provisioner node 24/7 and stake from its wallet.

- Run a node: [Provisioner node](/operator/provisioner)
- Set up wallet + stake: [Wallet setup](/operator/guides/node-wallet-setup)

### 2) Staking pools (no infrastructure)

Some third-party services and on-chain pools stake on behalf of users. This can let you earn staking yield without running your own node, but it adds operator and smart contract risk.

- If you're building a pool as a smart contract developer, see: [Stake Abstraction](/learn/hyperstaking)
- If you're a user, follow the pool/provider's instructions and do your own due diligence.

## Requirements and timing

- **Minimum stake**: 1,000 DUSK
- **Maturity**: 2 epochs (4,320 blocks), about 12 hours before rewards start
- **Unstaking**: no penalties or waiting period

:::note[Important]
New stake only starts earning rewards after the maturity period.
Operators can verify the `stake active from block` value using `rusk-wallet stake-info`.
:::

## How are rewards determined?

Once your stake is active, rewards are probabilistic and depend on consensus participation and the size of your stake relative to the total active network stake.

For reward sources and distribution details, see:

- [Incentives](/learn/tokenomics#incentives)
- [Token emission](/learn/tokenomics#token-emission)

## Slashing

Dusk uses **soft slashing**: stake is not burned, but repeated faults or long downtime can suspend rewards and reduce effective stake.

See: [Slashing](/learn/tokenomics#slashing).

## Adding to an existing stake

You can add to your stake without fully unstaking first.

- If your stake is already active, **90%** of the additional amount becomes active immediately and starts earning rewards. The remaining **10%** becomes **inactive stake**.
- Inactive stake does not earn rewards and can only be unlocked by fully unstaking.
- If you add stake before the original stake becomes active (still in the maturity period), the top-up follows normal maturity and is not subject to the 90%/10% split.

<details>
<summary><strong>Example</strong></summary>

Suppose you stake **5,000 DUSK**. After the maturity period, your stake becomes active.

If you later add **4,000 DUSK**:

- **3,600 DUSK (90%)** becomes active immediately.
- **400 DUSK (10%)** goes to inactive stake.

If you withdraw down to **600 DUSK** active stake, the **400 DUSK** inactive stake remains locked until you fully unstake the remaining active stake.

</details>

## Next steps

- Direct staking (run your own node): [Provisioner node](/operator/provisioner), then [Wallet setup](/operator/guides/node-wallet-setup)
- Understand rewards and emissions: [Tokenomics](/learn/tokenomics)
- If you hold ERC20/BEP20 DUSK: [Mainnet migration](/learn/guides/mainnet-migration)
