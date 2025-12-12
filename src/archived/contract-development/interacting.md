---
title: Interact with a contract
description: Learn the best practices for interacting with deployed smart contracts using Dusk’s tools and APIs.
---

## Sending and Withdrawing funds from contract

The transfer-contract (will) provide(s) two functions that can be used to withdraw or deposit funds to and from a contract.

Deposit funds into a contract, which essentially turn phoenix notes into a balance for that contract.
Withdraw funds from a contract, which turns said balance into phoenix notes again.

Both functions will be triggered by a call to the transfer-contract and the gas will always be paid in phoenix notes (for now).

Since the contract-balances are stored as part of the state of the transfer-contract there is no mechanism needed for a contract to 'consume' it's funds. 

### Sending

User makes transaction with crossover and with a call to the contract function taking Dusk (e.g. stake).
During execution of the function, the contract calls the transfer contract to "pick up" the Dusk left for it, panicking if not there
Contract proceeds with the knowledge that it now has that Dusk in its wallet.

### Withdrawing

User makes transaction without crossover and with a call to the contract function outputting Dusk (e.g. unstake).
During execution of the function, the contract takes the (given) stealth address and calls the transfer contract with it, sending money to said address.
Contract proceeds with the knowledge that that amount was successfully transferred to the stealth address.

## Interacting

The correct way of interacting with a contract is exemplified in the test folder of wallet-core, where there is a useful test. In particular, using this code:
```rust
fn execute_works() {
    let seed = [0xfa; RNG_SEED];
    let rng_seed = [0xfb; 32];
    let values = [10, 250, 15, 7500];

    let mut wallet = Wallet::default();

    let types::PublicSpendKeysResponse { keys } = wallet
        .call(
            "public_spend_keys",
            json!({
                "seed": seed.to_vec(),
            }),
        )
        .take_contents();
    let psk = &keys[0];

    let mut contract: ContractId = ContractId::uninitialized();
    contract.as_bytes_mut().iter_mut().for_each(|b| *b = 0xfa);
    let contract = bs58::encode(contract.as_bytes()).into_string();

    let (inputs, openings) = node::notes_and_openings(&seed, values);
    let crossover = Crossover::default();
    let blinder = JubJubScalar::default();

    let crossover = WasmCrossover {
        blinder: rkyv::to_bytes::<JubJubScalar, MAX_LEN>(&blinder)
            .unwrap()
            .to_vec(),
        crossover: rkyv::to_bytes::<Crossover, MAX_LEN>(&crossover)
            .unwrap()
            .to_vec(),
        value: 0,
    };

    let args = json!({
        "call": {
            "contract": contract,
            "method": "commit",
            "payload": b"We lost because we told ourselves we lost.".to_vec(),
        },
        "crossover": crossover,
        "gas_limit": 100,
        "gas_price": 2,
        "inputs": inputs,
        "sender_index": 0,
        "openings": openings,
        "output": {
            "note_type": "Obfuscated",
            "receiver": &keys[1],
            "ref_id": 15,
            "value": 10,
        },
        "refund": psk,
        "rng_seed": rng_seed.to_vec(),
        "seed": seed.to_vec()
    });

    let types::ExecuteResponse { tx } =
        wallet.call("execute", args).take_contents();

    rkyv::from_bytes::<tx::UnprovenTransaction>(&tx).unwrap();
}
```

The ref_id in the output is optional and represents a nonce used for generating the notes. If provided it is used, if not a random one is generated.

It is recommended to follow the tests in rusk, for example the staking one.

The code rusk-wallet is using currently is same being used on the rusk test cases (e.g. there is a get_stake call).
