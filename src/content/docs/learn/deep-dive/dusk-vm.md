---
title: DuskVM and Dusk Core
description: Learn about Dusk VM, the wasmtime VM that efficiently executes smart contracts on Dusk.

---

## Dusk VM

<a href="https://github.com/dusk-network/rusk/tree/master/vm" target="_blank">Dusk VM</a> is the WASM virtual machine for running Dusk's smart contracts, and it is based on the <a href="https://wasmtime.dev" target="_blank">Wasmtime</a> runtime, with a few custom modifications:
- Specific memory management mechanism
- Support for Dusk’s ABI
- Support for inter-contract calls 

Dusk VM functions as the host-side interface, handling the execution environment and system-level operations

##### Compiling contracts to WASM

Dusk VM expects WASM as bytecode, meaning that smart contracts must be compiled into WASM bytecode in order for Dusk VM to execute them. Smart contracts are entirely responsible for validating their inputs, processing them according to the contract’s logic, and returning the appropriate outputs. This ensures that smart contracts operate predictably and securely within the standardized execution environment provided by the Dusk VM.

Contracts compiled to WASM can be executed by Dusk VM, with the following caveats:
- The contract needs to expose the "argument buffer" (`argbuf`), which is a special region of 64KB in the contract's memory
- Each exposed function complies with the following calling convention: `fn foo(u32) -> u32`

The received u32 value indicates the length of the input data, which has been placed in the `argbuf` by the caller. This input length specifies how many bytes of data the contract should read from the `argbuf`. After processing the input, the contract writes the output data back into the argbuf. The return u32 value then indicates the length of this output data, specifying how many bytes of data the contract has written to the `argbuf`. This mechanism ensures that both the input and output lengths are communicated, allowing the contract to properly handle the data within the defined buffer space.

## Dusk Core

<a href="https://github.com/dusk-network/rusk/tree/master/core" target="_blank">Dusk Core</a> provides a lot of useful modules that can be used on the contract side to aid in development. It is the library that allows developers to create smart contracts directly on top of Dusk Core.
