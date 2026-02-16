---
title: Stake Abstraction
description: Learn how stake abstraction is implemented on Dusk via Hyperstaking, and how to use it in your smart contracts.
---

# What is Stake Abstraction?
Stake Abstraction (Hyperstaking) on Dusk allows smart contracts to participate in staking, removing the limitation where only user keys could stake. This enables programmable staking mechanisms such as automated staking pools, delegated staking services, and staking derivatives.

This page provides details on the technical implementation of Stake Abstraction, explaining how smart contracts can register as staking participants and interact with the staking contract.

High-level information about Stake Abstraction can be found [here](/learn/hyperstaking).
More on reward distribution can be found [here](/learn/guides/staking-basics#how-are-rewards-determined).

## How Stake Abstraction Works

Stake Abstraction relies on smart contracts interacting with the Staking Contract to perform key actions:

- For a smart contract to stake on behalf of itself or other users, it needs to register as a staking participant
- Once it's registered, the contract can initiate staking or unstaking operations.
- Staking rewards can be managed within the contract, allowing developers to implement custom reward distribution logic.

:::note[Note]
The minimum stake requirement applies also for contract. This means that a contract must stake at least 1,000 DUSK to participate in staking.
:::

:::note[Note]
The stake is considered active after a maturity period of 4320 blocks (~12 hours). Once matured, the smart contract starts earning rewards, distributed based on a node's probabilistic participation in block proposal and validation.
:::

### Interacting with the Stake Contract
Stake Abstraction requires contracts to interact with the <a href="https://raw.githubusercontent.com/dusk-network/contracts/main/genesis/stake/src/state.rs" target="_blank" rel="noreferrer">Stake Contract</a>.


#### Required contract calls

Functions that must be called from the Stake Contract are:

- `stake_from_contract(recv: ReceiveFromContract)` : Call this to stake funds from a contract.
- `unstake_from_contract(unstake: WithdrawToContract)` : Call this to unstake funds.
- `withdraw_from_contract(withdraw: WithdrawToContract)` : Call this to claim rewards.

#### Required implementations

Functions that must be implemented in your contract (similarly to the <a href="https://raw.githubusercontent.com/dusk-network/rusk/refs/heads/master/contracts/charlie/src/state.rs" target="_blank">example contract</a>) are:

- `receive_unstake(receive: ReceiveFromContract)` : Your contract must implement this to receive unstaked funds when they are returned.
- `receive_reward(receive: ReceiveFromContract)` : Your contract must implement this to receive staking rewards.

#### `ContractToContract` struct

When calling `stake_from_contract`, the transfer must be executed using a `ContractToContract` struct, which acts as a data structure containing the details of the transaction. 

An example of a `contract_to_contract` transfer would be:

```rust
let _: () = abi::call(
    TRANSFER_CONTRACT,
    "contract_to_contract",
    &contract_to_contract,
);
```

This ensures that:
- The stake is properly registered under the calling contract.
- The staking contract recognizes the funds.

Without using `contract_to_contract`, calling `stake_from_contract` will fail.

## How To implement Stake Abstraction

To implement Stake Abstraction, you can refer to <a href="https://raw.githubusercontent.com/dusk-network/rusk/refs/heads/master/contracts/charlie/src/state.rs" target="_blank">this example</a>.

Differently from normal users, that stake directly by calling `stake(stake: Stake)`, smart contracts must use `stake_from_contract(recv: ReceiveFromContract)`.

This is because the <a href="https://raw.githubusercontent.com/dusk-network/contracts/main/genesis/stake/src/state.rs" target="_blank" rel="noreferrer">Stake Contract</a> defines `stake_from_contract(recv: ReceiveFromContract)`, which requires a `ReceiveFromContract` object. By doing so, it ensures that the calling contract is verified as the stake owner and that the function is only triggered as part of a fund transfer.

In the <a href="https://raw.githubusercontent.com/dusk-network/rusk/refs/heads/master/contracts/charlie/src/state.rs" target="_blank">example</a> implementation, `stake()` does not call `stake_from_contract` directly. Instead, it first transfers the funds and then invokes `stake_from_contract` via a `contract-to-contract` call.


If a contract attempted to call `stake_from_contract` directly, it would fail because:

- The Stake Contract requires a `ReceiveFromContract` object, not a `Stake` object.
- `recv.contract`must match the calling contract, which only happens during a transfer operation.
- No funds would be transferred, as the staking contract validates the transaction amount inside `stake_from_contract`


:::note[Note]
The only correct way to call `stake_from_contract` is by transferring funds first, which is why in the <a href="https://raw.githubusercontent.com/dusk-network/rusk/refs/heads/master/contracts/charlie/src/state.rs" target="_blank">example</a> the `stake_from_contract` is wrapped inside a `contract_to_contract` call.
:::

For this reason in the  <a href="https://raw.githubusercontent.com/dusk-network/rusk/refs/heads/master/contracts/charlie/src/state.rs" target="_blank">example contract</a>, the `stake()` function is a wrapper that:

- Transfers funds into the contract.
- Calls `stake_from_contract` indirectly, using `contract_to_contract`.

To unstake or withdraw rewards, the functions `unstake_from_contract` and `withdraw_from_contract` are used.

### Deposit funds and start staking

Before calling `stake_from_contract`,  you need to ensure that funds are deposited into the contract.
Then, the contract can transfer those funds to `STAKE_CONTRACT`, calling the `stake_from_contract`method:

```rust
pub fn stake(&mut self, stake: Stake) {
    let value = stake.value();
    let data = rkyv::to_bytes::<_, SCRATCH_BUF_BYTES>(&stake)
        .expect("Stake serialization should succeed")
        .to_vec();

    // 1️⃣ Deposit funds into this contract
    let _: () = abi::call(TRANSFER_CONTRACT, "deposit", &value)
        .expect("Depositing funds into contract should succeed");

    // 2️⃣ Call `stake_from_contract` via a contract-to-contract transfer
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

### Unstaking funds

When unstaking, the staking contract doesn’t return funds immediately.
Instead, the funds are sent later to a callback function.

To unstake, you can call `unstake_from_contract`, and once that is completed, `receive_unstake` is called.

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
        "receive_unstake", // Callback function
    )
    .with_data(data);

    let _: () = abi::call(
        STAKE_CONTRACT,
        "unstake_from_contract",
        &withdraw_to_contract,
    )
    .expect("Unstake from stake contract should succeed");
}
```

### Receiving unstaked funds

When `receive_unstake()` is called, the funds aren’t withdrawn yet.
The contract must manually withdraw them from the `TRANSFER_CONTRACT`:

```rust
pub fn receive_unstake(&mut self, receive: ReceiveFromContract) {
    let withdraw: TransferWithdraw = rkyv::from_bytes(&receive.data)
        .expect("Withdraw should deserialize");

    let _: () = abi::call(TRANSFER_CONTRACT, "withdraw", &withdraw)
        .expect("Withdrawing stake should succeed");
}
```

### Withdrawing staking rewards

As rewards aren’t automatically withdrawn, your contract must request them.
Similarly to unstaking, you must use `withdraw_from_contract` and specify a callback:

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
```

### Receiving withdrawn rewards
After calling `withdraw_from_contract`, the staking contract sends rewards back to the contract.
Your contract must withdraw the rewards from the `TRANSFER_CONTRACT`:

```rust
pub fn receive_reward(&mut self, receive: ReceiveFromContract) {
    let withdraw: TransferWithdraw = rkyv::from_bytes(&receive.data)
        .expect("Withdraw should deserialize");

    let _: () = abi::call(TRANSFER_CONTRACT, "withdraw", &withdraw)
        .expect("Withdrawing rewards should succeed");
}
```
