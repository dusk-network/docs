---
title: Stake Abstraction
description: Stake Abstraction (Hyperstaking) lets smart contracts stake DUSK. This page includes the technical integration guide.
---

Stake Abstraction (Hyperstaking) lets **smart contracts** participate in staking on Dusk. This enables on-chain staking pools and other programmable staking logic.

## When you need it

Use stake abstraction if a **contract** needs to own/manage stake and rewards, for example:

- Liquid staking / staking pools
- Delegated staking services (staking-as-a-service)
- Staking derivatives and automated reward distribution

If you are staking as an individual from a wallet, you do not need this page. Use the normal staking flow instead.

## Use cases

### Liquid staking / staking pools

A contract can accept deposits, stake on behalf of depositors, and distribute (or reinvest) rewards according to its own rules.

Example: <a href="https://x.com/sozu_dusk" target="_blank" rel="noreferrer">Sozu</a> runs an automated staking pool so users can stake without operating their own node.

### Referral / affiliate staking

Contracts can implement arbitrary reward-splitting rules (for example: route a portion of rewards to referrers, affiliates, or operators).

## Protocol-level notes

- The **minimum stake** requirement applies to contracts too: **1,000 DUSK**.
- Stake is considered active after a maturity period of **4320 blocks (~12 hours)**.
- Reward distribution depends on consensus participation; see [Staking basics](/learn/guides/staking-basics#how-are-rewards-determined).

## Technical guide (smart contract developers) {#technical-guide}

Stake abstraction requires contracts to interact with the genesis **Stake Contract** (and the **Transfer Contract** for contract-to-contract calls).

### Reference links

- Stake contract source:
  <a href="https://raw.githubusercontent.com/dusk-network/contracts/main/genesis/stake/src/state.rs" target="_blank" rel="noreferrer">genesis/stake</a>
- Transfer contract source:
  <a href="https://raw.githubusercontent.com/dusk-network/contracts/main/genesis/transfer/src/state.rs" target="_blank" rel="noreferrer">genesis/transfer</a>
- Example implementation:
  <a href="https://raw.githubusercontent.com/dusk-network/rusk/refs/heads/master/contracts/charlie/src/state.rs" target="_blank" rel="noreferrer">rusk/contracts/charlie</a>

### Required Stake Contract calls

These are called on the Stake Contract:

- `stake_from_contract(recv: ReceiveFromContract)` to stake from a contract.
- `unstake_from_contract(unstake: WithdrawToContract)` to unstake.
- `withdraw_from_contract(withdraw: WithdrawToContract)` to claim rewards.

### Callbacks your contract must implement

Your contract must implement these callbacks (see the example contract above):

- `receive_unstake(receive: ReceiveFromContract)` to receive unstaked funds.
- `receive_reward(receive: ReceiveFromContract)` to receive staking rewards.

### Important: `stake_from_contract` must be triggered via a transfer

Unlike user staking (`stake(stake: Stake)`), contracts cannot call `stake_from_contract` directly.

`stake_from_contract` expects a `ReceiveFromContract` and validates that it is invoked as part of a fund transfer, so the correct pattern is:

1. Move funds into the contract.
2. Perform a `contract_to_contract` transfer to the stake contract, with `fn_name = "stake_from_contract"`.

### Examples (Rust)

<details>
<summary>Stake via <code>contract_to_contract</code></summary>

```rust
pub fn stake(&mut self, stake: Stake) {
    let value = stake.value();
    let data = rkyv::to_bytes::<_, SCRATCH_BUF_BYTES>(&stake)
        .expect("Stake serialization should succeed")
        .to_vec();

    // 1) Deposit funds into this contract
    let _: () = abi::call(TRANSFER_CONTRACT, "deposit", &value)
        .expect("Depositing funds into contract should succeed");

    // 2) Call `stake_from_contract` via a contract-to-contract transfer
    let contract_to_contract = ContractToContract {
        contract: STAKE_CONTRACT,
        value,
        data,
        fn_name: "stake_from_contract".into(),
    };

    let _: () = abi::call(
        TRANSFER_CONTRACT,
        "contract_to_contract",
        &contract_to_contract,
    )
    .expect("Transferring to stake contract should succeed");
}
```

</details>

<details>
<summary>Unstake + receive callback</summary>

```rust
pub fn unstake(&mut self, unstake: Withdraw) {
    let value = unstake.transfer_withdraw().value();
    let data =
        rkyv::to_bytes::<_, SCRATCH_BUF_BYTES>(unstake.transfer_withdraw())
            .expect("Withdraw serialization should succeed")
            .to_vec();

    let withdraw_to_contract = WithdrawToContract::new(
        *unstake.account(),
        value,
        "receive_unstake",
    )
    .with_data(data);

    let _: () = abi::call(
        STAKE_CONTRACT,
        "unstake_from_contract",
        &withdraw_to_contract,
    )
    .expect("Unstake from stake contract should succeed");
}

pub fn receive_unstake(&mut self, receive: ReceiveFromContract) {
    let withdraw: TransferWithdraw = rkyv::from_bytes(&receive.data)
        .expect("Withdraw should deserialize");

    let _: () = abi::call(TRANSFER_CONTRACT, "withdraw", &withdraw)
        .expect("Withdrawing stake should succeed");
}
```

</details>

<details>
<summary>Withdraw rewards + receive callback</summary>

```rust
pub fn withdraw(&mut self, unstake: Withdraw) {
    let value = unstake.transfer_withdraw().value();
    let data =
        rkyv::to_bytes::<_, SCRATCH_BUF_BYTES>(unstake.transfer_withdraw())
            .expect("Withdraw serialization should succeed")
            .to_vec();

    let withdraw_to_contract = WithdrawToContract::new(
        *unstake.account(),
        value,
        "receive_reward",
    )
    .with_data(data);

    let _: () = abi::call(
        STAKE_CONTRACT,
        "withdraw_from_contract",
        &withdraw_to_contract,
    )
    .expect("Withdraw rewards from stake contract should succeed");
}

pub fn receive_reward(&mut self, receive: ReceiveFromContract) {
    let withdraw: TransferWithdraw = rkyv::from_bytes(&receive.data)
        .expect("Withdraw should deserialize");

    let _: () = abi::call(TRANSFER_CONTRACT, "withdraw", &withdraw)
        .expect("Withdrawing rewards should succeed");
}
```

</details>
