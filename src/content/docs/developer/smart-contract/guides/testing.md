---
title: Test a contract
description: A detailed guide to effectively test your Dusk smart contracts using integration tests and the Nocturne testnet.
---

<!-- This guide will explain how to test a contract based on the previous counter Contract from [My first contract](/developer/smart-contract/guides/my-first-contract) -->

## Writing tests for Contracts

Writing tests for contracts is not as straightforward as for normal Rust programs, because we are in a no_std environment and are using smart contracts that are meant to run in the VM.

There are currently two feasible ways to test your contracts:

- Integration tests can be used to test the interface of the created WASM module with an [ephemeral VM](https://github.com/dusk-network/rusk/blob/8e6bb4937fe2ed5fe735f8dd7c5da0b8d079e5c3/vm/src/lib.rs#L107) from `dusk-vm`. Integration tests can only call the functions which are publicly available (Every function that got wrapped with [dusk-core](https://github.com/dusk-network/rusk/tree/8e6bb4937fe2ed5fe735f8dd7c5da0b8d079e5c3/core) through `wrap_call`).
- Deployment & testing on the testnet Nocturne. This can also be automated through a testing project that makes use of the wallet-sdk from Integrations.

An example for integration testing can be seen in the tests folder of our genesis contracts, for example the [staking contract](https://github.com/dusk-network/rusk/tree/master/contracts/stake/tests) or the [transfer contract](https://github.com/dusk-network/rusk/tree/master/contracts/transfer/tests).

### Testing on Nocturne

Testing on Nocturne requires you to deploy the smart contract to the Nocturne chain and call the functions there via transactions. To get nDusk for the testnet you can use the [Faucet](/operator/networks#how-to-get-testnet-tokens).

## Additional Resources

- More information on Rusts integration testing capabilities can also be found in the <a href="https://doc.rust-lang.org/book/ch11-03-test-organization.html#integration-tests" target="_blank">Rust book</a> section about integration tests.
