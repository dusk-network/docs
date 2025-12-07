---
title: Core Concepts
description: Learn the foundational principles of Dusk’s smart contract platform, including zero-knowledge proofs, privacy, and decentralized execution.
---

This page explains in more detail the core concepts, namings, conventions and building blocks for developing smart contracts on Dusk. If you want to dive right into development, you can directly go to the [Guides](/developer/smart-contract/guides/my-first-contract).

## State & Persistence

### Persistence

Each smart contract on Dusk has its own state, which is the persistent data maintained by the contract. This means that for every smart contract, there is a single, globally consistent state at any time, maintained across all nodes.

A smart contract is allowed to write data in any way it likes to the underlying <a href="https://webassembly.github.io/spec/core/intro/overview.html#memory" target="_blank">linear memory</a>, which is a contiguous, mutable array of raw bytes. The linear memory is created with an initial size but can be grown dynamically, and a program can load and store values from/to a linear memory at any byte address.

At a programmatic level, this implies that by using Rust, developers can use any data structure which can compile to WASM. Updating any of these implies a state transition, which is recorded on the blockchain and ensures a permanent and immutable record of all changes.

### Smart Contract State

Our smart contract is naturally part of the global blockchain state. Our contract's state partially comes from the bytecode we deploy and the contract metadata, but also the state that is managed within the contract.

This contract state is defined within our contracts as a static mutable constant and often maintains a single struct. This state is naturally a substate of the global state. However, when talking about the state, we usually refer to this constant because the underlying global state from the blockchain is an implementation detail we do not necessarily need to care about.

An example state of a counter contract that maintains a single counter value would look like this:
```rust
static mut STATE: MyContract = MyContract { counter: 0 };
```

When writing smart contracts, we usually implement methods on the struct that either take `&mut self` and can transform the state (write access) or only take `&self` to access and return information (read-only).

It is important to note that even if that state within the smart contract can change through transactions, the contract code itself is **immutable** once deployed. 

:::note[Note]
A proxy contract upgrading mechanism for example does not impact the immutability of contract code; it merely changes a pointer to point towards another contract. Data in a contract is mutable if the contract's logic allows for it.
:::

## Rust No-std

One of the core concepts impacting development in Rust is the fact that we are developing smart contracts that compile to WASM. This requires the `#![no_std]` flag to be set in your project, which means that smart contracts are written in a no_std environment where certain features are not available.

#![no_std] tells rust to link to the **core** crate instead of the **std** crate. The core crate provides a subset of the std crate. It works within WASM because it makes no assumptions about the system which executes the program.

Because the **core** crate lacks heap memory allocations, we can explicitly also import the **alloc** crate where needed.

### Usage of panic & reverting state

While you can have Result types in your smart contracts and handle them in multiple function calls, in the end you may want to abort execution. For example if a specific requirement is not satisfied you can always make use of directives that lead to panic (e.g., `.expect()` or `panic!()`). This is equivalent to `require()` in Solidity. It will abort the smart contract execution and let the transaction [fail](/learn/deep-dive/tx-fees#unsuccessful-transactions). This will also **revert** the state, making no changes to it.

## UTXO & Account-model

Dusk supports both UTXO and account-based capabilities as it offers you a high level of freedom on how to design and write your contracts.

### Absence of msg.sender

TODO: Add information on `msg.sender` equivalent

In Dusk, there is no built-in variable like `msg.sender` which identifies the caller of a contract function. This is because Dusk is a privacy-focused blockchain, utilizing a UTXO-based privacy preserving transaction model ([Phoenix](/learn/deep-dive/duskds-tx-models)) by default.

Therefore developers need to figure out how to represent users. 

In Dusk, an "address" is defined by the developer within the contract's logic. This approach gives developers more control over the privacy and compliance features of their applications but also increases their responsibility to securely identify and authenticate users and transactions. 

The `msg.sender` is not "abstracted" away on dusk. A way to mimic that behavior is by explicitly taking the address as function argument and a signature that signed all other function arguments (including the address). Then verifying this in the function. Examples of such usage can be found in the [Moonlight transaction model](/learn/deep-dive/duskds-tx-models).

## Methods

Smart contracts on Dusk can retrieve data from other contracts without altering their contract’s state, as well as modifying the contract’s state without returning any data. 

In order for a smart contract to modify its state, a transaction is needed.

Each contract has a memory area for argument passing, and host methods simplify this process by handling the details. Utilizing host-provided methods can result in significant computational power savings, especially for intensive functions like cryptographic and zero-knowledge proofs.

The logic of a smart contract is executed by calling one of its methods. Methods can be called by users directly, or by other smart contracts. Methods can consume data and can branch their code based on its properties, and on other conditions such as the current state of the chain.
Based on these conditions, the method may decide to continue execution of the contract's logic, or reject the execution entirely. 

The product of the execution depends on the coded logic, which can involve transferring funds, issuing digital assets, triggering other contracts, etc.

Smart contracts can be programmed to execute specific code when receiving cryptocurrencies. This means that when a user sends cryptocurrency to a smart contract's address, the contract can automatically perform predefined actions based on the received funds.

Smart contracts on the Dusk blockchain employ two types of methods: 
- **Queries**: designed to retrieve data without altering the contract’s state.
- **Transactions**: designed to modify the contract’s state but do not return data. 

This distinction is crucial for understanding how smart contracts interact with the Dusk blockchain.

Understanding the mechanism of argument passing to and from queries and transactions is beneficial, as each contract has a memory area for argument passing, and host methods simplify this process by handling the details. Utilizing host-provided methods can result in significant computational power savings, especially for intensive functions like cryptographic has functions and zero-knowledge proof verification.

## Built-in Functions

Rusk provides built-in functions that can be called from within a smart contract which we call **Host functions** or **Host queries**.

### Host functions

Host functions are functions provided by rusk (the "host") and can be called from within a smart contract running on the VM. Due to the sandboxed nature of VMs, smart contracts need to rely on host functions to access and manipulate lower-level operations that are managed by the Dusk nodes (e.g., time checks, cryptographic functions...).

Simply put, host functions are necessary because they allow smart contracts to interact with the system-level functions of the machine on which they run.

:::tip
Host functions are exempt from the normal costs associated (Gas costs) with computing VM instructions.
:::

> Ethereum calls them pre-compiles


### Available Host functions

The available host functions are exposed through the `abi` module within `dusk-core`:

<a href="https://github.com/dusk-network/rusk/blob/master/core/src/abi.rs">abi.rs</a>

<details>
<summary>More on interaction between a smart contract & the host </summary>

Functions Signature and Calling Sequence:

The interaction between the smart contract and the host involves a series of steps designed to safely pass data back and forth while respecting the sandboxed environment in which the smart contract operates. 

Here's a breakdown of the process and why each step is crucial:

**1) Function Signature:** The function to be called from the host has a specific signature `(fn foo(u32) -> u32)`. This uniformity is necessary because it simplifies the interface through which the host VM interacts with the contract, ensuring that calls are predictable and structured.

**2) Writing to the Argument Buffer:** Instead of passing complex and potentially variable data types directly, the host writes his data into a designated argument buffer. This method standardizes how data is provided to the contract, regardless of the specific operation being performed.

**3) Calling the Function:** The smart contract’s function is invoked with an argument that typically represents the length or size of the data in the buffer. This helps the contract know how much data it needs to process.

**4) Deserialization of Data:** The contract reads and deserializes the data from the argument buffer. Deserialization is converting data from a byte array (buffer) into usable data types within the contract.

**5) Contract Processing:** The contract performs its intended operations using the deserialized data.

**6) Serializing Results into the Argument Buffer:** After processing, the contract serializes any results back into the argument buffer. Serialization is the process of converting the contract's internal data types back into a standardized byte format that can be read by the host.

**7) Return Data Length:** The contract returns the length of the serialized data, informing the host how much data to read from the buffer.

**8) Host Reads Buffer:** Finally, the host reads the output data from the buffer based on the provided length.

:::note
The use of an argument buffer and the serialization/deserialization prevents unsafe interactions between the host and the contract's internal state, ensuring that data passed between the host and the contract is done so in a controlled manner.
:::
</details>

## Cryptographic Keys

Developers are free to choose any cryptographic signature algorithm when building on Dusk, as they can use various cryptographic primitives, as long as they are WASM-compatible. As an example, developers can choose BLS, JubJub Schnorr, ECDSA, Bitcoin's Secp256k1 and much more. The choice usually depends on requirements for security, signature size, and transaction efficiency.

For developers opting to use BLS signatures, it is recommended to leverage the `dusk_core::abi::verify_bls` host function provided by Dusk. This function enables signature verification to be offloaded to the host, minimizing the gas consumption and execution time of contracts. Directly including complex cryptographic operations within the contract is still possible but less efficient in terms of gas usage.

### Types of keys

Dusk uses three types of keys: 
- <a href="https://github.com/dusk-network/bls12_381-sign" target="_blank">BLS-signature keys</a>: used in the consensus, the stake contract and Moonlight.
- <a href="https://github.com/dusk-network/jubjub-schnorr" target="_blank">Schnorr-signature keys</a>: used within the Phoenix transaction model for note-signing and sender information generation.
- <a href="https://github.com/dusk-network/phoenix-core" target="_blank">Phoenix keys</a>: used for Phoenix transactions.

Keys in Dusk work slighly different compared to other protocols:
`PublicSpendKeys` and `SecretSpendKeys` are equivalent to the traditional key-pairs used in other blockchains to manage transactions.

`PublicKeys` and `SecretKeys` are instead single-use keys derived from `PublicSpendKeys` and `SecretSpendKeys`. They are specifically used to prove and assign note ownership during transactions.

### Keys creation and verification

The process for handling transactions in Dusk involves several key generation and verification steps:

1) Generate Phoenix private key.
2) Derive Phoenix public key.
3) Generate stealth address from Phoenix public key and a JubJubScalar.
4) Generate Schnorr private key from Phoenix private key combined with the stealth address.
5) Sign the claims with the Schnorr private key and verify with the Phoenix public key.

More specifically, a `jubjub-schnorr::SecretKey` can be created with `phoenix-core::SecretKey` by calling `SecretKey::gen_note_sk`. A message can be signed with that `jubjub-schnorr::SecretKey` and verified with a `jubjub-schnorr::PublicKey`.

Creation and verification of signatures (both Schnorr signatures and BLS signatures) roughly follow this flow:
```rust
// get a random secret key
let sk = SecretKey::random(rng);
// generate public key from secret key
let pk = PublicKey::from(sk);

// sign a message with the secret key
let signature = sk.sign(message);

// verify the signature with the public key
assert!(pk.verify(signature));
```

### Considerations

It is important to understand that for the final step, the `verify_schnorr` function expects a `NotePublicKey` instead of a `phoenix` public key. This implies that a `NotePublicKey` needs to be added in the contract, because considering that the owner of the contract is a `phoenix` public key, the method `verify_schnorr` cannot be called with only that public key.
This implies that a Schnorr signature cannot be verified with only a `phoenix` public key. 

The `schnorr-sk` is derived from `phoenix-sk` using a random value `r`. If the same `r` is used to generate a stealth address from a `phoenix-pk`, then the `note-pk` (which is a `schnorr-pk`) in that stealth address can be used to verify the `schnorr-sig` signed with the `schnorr-sk`.

## Serialization

Serialization and deserialization are essential for smart contracts to efficiently handle data within the VM. Serialization converts data structures of a smart contract into a format that can be easily transmitted or stored, while deserialization converts this data back into a usable form.

While various serialization and deserialization frameworks can be used, Dusk uses [rkyv](https://rkyv.org/) to handle data calls to smart contracts for performance reasons. 

### rkyv example

**Rkyv** is a zero-copy deserialization framework that serializes data structures in-place. This means that once data is serialized, it can be deserialized without copying it, making it very efficient.

For a type to be passable through the VM boundary automatically, developers need to implement the `rkyv traits`, for example by deriving them. 

As an example, here it can be seen how the traits for a `Note` have been derived:

```rust
#[cfg_attr(
    feature = "rkyv-impl",
    derive(Archive, Serialize, Deserialize),
    archive_attr(derive(bytecheck::CheckBytes))
)]
pub struct Note {
    pub(crate) note_type: NoteType,
    pub(crate) value_commitment: JubJubExtended,
    pub(crate) nonce: BlsScalar,
    pub(crate) stealth_address: StealthAddress,
    pub(crate) pos: u64,
    pub(crate) encrypted_data: PoseidonCipher,
}
```

## The host

In the context of Dusk we usually refer to Rusk as "the host" because Rusk incorporates the VM, thus being the host that executes smart contracts. This is also the reason why certain built-in functions are called **Host functions** or why your smart contract functions need to be exposed to "the host" in order to be callable. Those functions and the exposing is being made available through [dusk-core](https://github.com/dusk-network/rusk/tree/master/core).

## Rusk

<a href="https://github.com/dusk-network/rusk" target="_blank">Rusk</a> is the official Dusk protocol node client and smart contract platform. It plays a key role in Dusk by enabling the execution of smart contracts and handling the consensus. 

### Dusk Core

The `dusk-core` crate encapsulates a number of features, from transaction construction and validation, to ABIs exposed to smart contract developers. 

The most important feature flag `dusk-core` exposes is the `abi-dlmalloc` feature for developing smart contracts. The `abi-dlmalloc` feature allows you access specific features of the VM like the explained built-in functions, as well as the `dlmalloc` allocator.

#### Expose Functions

In order for smart contract functions to be accessible via transactions on Dusk, they need to be exposed using features provided by `dusk-core`. Exporting those functions is being done through `dusk_core::abi::wrap_call`. An example for that can be found in the [Guide](/developer/smart-contract/guides/my-first-contract#expose-functions).

The `dusk_core::abi::wrap_call` function serves to wrap contract methods in a way that ensures they can be safely and effectively called by the host environment. This ensures that any errors that occur during the execution of the function are caught and handled appropriately, avoiding uncontrolled errors that can affect the VM state. Wrapping the call also helps converting inputs and outputs between the formats expected by the smart contract and those used by the host environment (e.g., data type conversions), as well as performing security checks.

##### no_mangle

Name mangling is a technique used by compilers to encode additional information about a function (like its namespace and signature) into its name. While this is useful in many programming scenarios to avoid name conflicts and support features like function overloading, it can pose a problem in the context of compiling smart contracts to WASM.

When a smart contract is compiled to WASM and run on our VM, the host environment needs to be able to reliably call the functions defined in the contract. If function names are mangled, the host might not be able to correctly identify and invoke these functions because the original function names specified in the contract code would have been altered during compilation.

By using the `#[no_mangle]` attribute, developers ensure that the compiler does not alter the function names. This preserves the function names exactly as they are defined in the Rust source code, making it straightforward for the host environment to access and execute these functions correctly based on their known names.

Therefore contract methods are exposed to the host environment using `#[no_mangle]` and `dusk_core::abi::wrap_call`, facilitating safe interaction with the host.

#### Callcenter

#### Events

Smart contracts on Dusk can use events as a lightweight mechanism to provide feedback, and they are particularly useful for triggering actions on the caller's side. Events are provided through `dusk_core::abi::emit`.

Events serve as a logging mechanism that facilitates interactions between various applications and can be emitted by either queries or transactions. Events can be processed post-call by the caller, which can then execute its logic accordingly.

Clients can subscribe to events emitted by both smart contracts and nodes by using the <a href="https://github.com/dusk-network/rusk/wiki/RUES-(Rusk-Universal-Event-System)" target="_blank">Rusk Universal Event System</a>.


### ICC panic behaviour

In Dusk’s inter-contract call (ICC) model, a contract panic (e.g., from a failed assertion) behaves very differently from an EVM-style revert (e.g., as in Ethereum). In Solidity, a failed `require` immediately triggers a revert that rolls back all state changes in the entire transaction, even across multiple contract calls. In Dusk, a panic only rolls back the state changes of the called contract itself, not the entire transaction. When a contract panics, it returns a `PanicError` to the caller contract, and the caller’s execution can choose how to handle it. If the caller does not explicitly handle the panic, execution simply continues after the call.

For example, suppose Contract A calls Contract B, and B encounters a panic. Rusk will automatically discard any state changes B made before panicking and then return an error receipt up to A. If A’s code does not catch this error, A’s execution resumes normally. A can use a try/catch-style pattern to detect the panic and respond to it. 

Dusk ensures that only the failing contract’s work is undone by default, and your contract must explicitly handle panics from other contracts. While in the EVMs any unhandled revert in a sub-call automatically aborts the entire transaction, Dusk's design allows for a more granular error recovery. 


:::note[Note]
A Dusk contract panic only undoes its own changes and returns a `PanicError` to the caller. The caller can catch and handle it or ignore it. This fundamental difference means Dusk contracts must be written to explicitly check for and handle panic errors from calls.
:::