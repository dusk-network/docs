---
title: Staking on Dusk
description: Choose a staking method and understand activation, rewards, top-ups, unstaking, and slashing.
---

Staking secures Dusk by selecting provisioners to propose and validate blocks. Active provisioners earn rewards from token emissions and transaction fees.

## At a glance

| | |
|---|---|
| Minimum direct stake | 1,000 DUSK |
| Activation | At the epoch boundary after the next one; normally about 6 to 12 hours |
| Direct staking requirement | A provisioner node that remains online and synchronized |
| Unstaking | No protocol waiting period; network fees apply |
| Rewards | Probabilistic, based on consensus participation and active stake |

## Choose how to stake

### Run a provisioner

Direct staking gives you protocol rewards and responsibility for operating a provisioner node. The node must remain online, synchronized, correctly configured, and on the required software version.

1. [Run a provisioner node](/operator/provisioner/).
2. [Set up its wallet and stake](/operator/guides/node-wallet-setup/).

### Use a staking pool

Third-party services and on-chain pools can stake without requiring you to operate a node. Their yield, withdrawal rules, custody model, operator risk, and smart-contract risk are separate from the base protocol.

Evaluate the provider independently before depositing. Developers building staking pools should see [Stake Abstraction](/learn/hyperstaking/).

## Direct stake lifecycle

### Activation

A new stake does not participate immediately. It becomes eligible at the start of the epoch after the next epoch boundary.

An epoch is 2,160 blocks. Depending on where the staking transaction lands within the current epoch, activation takes between roughly one and two epochs, normally about 6 to 12 hours at the target block time.

Check the exact `stake active from block` value with:

```sh
rusk-wallet stake-info
```

### Rewards

Once active, rewards depend on consensus participation and the stake's size relative to total active stake. They are not a fixed return and may vary between periods.

See [Incentives](/learn/tokenomics#incentives) and [Token emission](/learn/tokenomics#token-emission) for how rewards are funded and distributed.

### Adding to an existing stake

- A top-up submitted before the original stake becomes active follows the existing activation schedule.
- Once the stake is active, 90% of a top-up becomes active immediately and 10% is recorded as locked stake.
- Locked stake remains yours but does not participate in consensus. Recovering the final locked portion may require fully unstaking the remaining position.

For example, adding 4,000 DUSK to an active stake adds 3,600 DUSK to active stake and 400 DUSK to locked stake.

### Unstaking

There is no protocol waiting period after a successful unstaking transaction. You can fully unstake, or partially unstake while leaving a position that still satisfies the 1,000 DUSK minimum.

Unstaking active and locked stake does not automatically withdraw accrued rewards; reward withdrawal is a separate wallet action.

## Slashing risk

Dusk distinguishes between two classes of consensus penalty:

- **Soft penalties** cover failed participation, such as failing to produce a valid candidate. They can suspend eligibility and move part of active stake into locked stake. The locked amount remains owned by the staker.
- **Hard penalties** cover provably invalid consensus behavior, including invalid votes or signing conflicting proposals or votes. They suspend eligibility and can burn part of the stake.

Run only supported software and never run the same consensus key on multiple active nodes. Operators should follow [Slashing prevention and recovery](/operator/guides/slashing-recovery/).

## Next steps

- [Run a provisioner node](/operator/provisioner/)
- [Set up a node wallet](/operator/guides/node-wallet-setup/)
- [Monitor a provisioner](/operator/maintenance-monitoring/)
- [Understand DUSK tokenomics](/learn/tokenomics/)
