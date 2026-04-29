---
title: DuskVM
description: Learn about DuskVM, the Wasmtime-based VM that executes native smart contracts on Dusk.

---

## Overview

[DuskVM](https://github.com/dusk-network/rusk/tree/master/vm) is the WASM virtual machine for native smart contracts on Dusk. It is based on the <a href="https://wasmtime.dev" target="_blank" rel="noreferrer">Wasmtime</a> runtime, with custom support for Dusk’s execution model.

Use DuskVM when your application needs native Dusk execution: protocol-level assets, Rust/WASM contracts, custom execution, privacy, or zero-knowledge capabilities close to the settlement layer.

Use DuskEVM instead when your application is designed around Solidity, EVM wallets, and Ethereum-compatible tooling. See [DuskEVM](/learn/deep-dive/dusk-evm).

## Where DuskVM fits

DuskVM is part of the DuskDS layer. It is the native execution environment for smart contracts that should live close to the Dusk L1 transaction models and settlement layer.

At a high level, DuskVM provides:

- Specific memory management mechanism
- Support for Dusk’s ABI
- Support for inter-contract calls 

DuskVM functions as the host-side interface, handling the execution environment and system-level operations.

## Compiling contracts to WASM

DuskVM expects WASM as bytecode, meaning that smart contracts must be compiled into WASM bytecode in order for DuskVM to execute them. Smart contracts are entirely responsible for validating their inputs, processing them according to the contract’s logic, and returning the appropriate outputs. This ensures that smart contracts operate predictably and securely within the standardized execution environment provided by DuskVM.

Contracts compiled to WASM can be executed by DuskVM, with the following caveats:
- The contract needs to expose the "argument buffer" (`argbuf`), which is a special region of 64KB in the contract's memory
- Each exposed function complies with the following calling convention: `fn foo(u32) -> u32`

The received u32 value indicates the length of the input data, which has been placed in the `argbuf` by the caller. This input length specifies how many bytes of data the contract should read from the `argbuf`. After processing the input, the contract writes the output data back into the argbuf. The return u32 value then indicates the length of this output data, specifying how many bytes of data the contract has written to the `argbuf`. This mechanism ensures that both the input and output lengths are communicated, allowing the contract to properly handle the data within the defined buffer space.

## Dusk Core

<a href="https://github.com/dusk-network/rusk/tree/master/core" target="_blank" rel="noreferrer">Dusk Core</a> provides modules that can be used on the contract side to aid development. It is the library that allows developers to create smart contracts directly on top of Dusk Core.
