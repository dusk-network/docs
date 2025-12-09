---
title: Debug a contract
description: Explore debugging techniques to optimize your smart contracts for Dusk’s environment.
---

The `abi-debug` feature of `dusk-core` is meant for debugging while writing the contracts. It allows developers to print logs to stdout from the contract, making inspecting the state a bit easier.

## WASM tools

Useful WASM tools can be found <a href="https://github.com/bytecodealliance/wasm-tools" target="_blank">here</a>.

Of those, WebAssembly text format (WAT) is a "friendly" representation of WASM which can be used with `wasm-tools print foo.wasm`.

## Troubleshooting

#### Error 500: PolynomialDegreeTooLarge

When trying to call a method on a contract, the `PolynomialDegreeTooLarge` error indicates an issue with proving in Plonk proving system. It likely means that an attempt was made to prove something incorrect, such as proving ownership of something not actually owned or violating Dusk conservation rules.

#### Unexpected information returned

If code fails when passing in a vector but correctly executes when passing an array, you may see that unexpected information is returned, similarly to:

```rust
{
    name: "Entering constructorwETH\0\0\0\u{4}wETH\0\0\0\u{4}\t\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0",
    symbol: " constructorwETH\0\0\0\u{4}wETH\0\0\0\u{4}\t\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0",
    decimals: 99
}
```

The issue arises because the argument buffer is written to before it is read from. The `dusk_core::abi::piecrust_debug` function writes a string ("Entering constructor") to the argument buffer. Then, the `dusk_core::abi::wrap_call` function reads an argument from the buffer, passes it to the closure, and writes the closure's return value back to the same buffer. This sequence of operations is incorrect and leads to the corrupted output seen in the returned struct.

The reason why this may happen with an array but not with a vector, is that when `STATE.init` takes an array, the serialization process simply serializes the bytes of the array.

When it takes a `Vec`, the length of the vector must also be serialized. This difference in handling results in the observed behavior where using an array does not cause a panic, but using a `Vec` does.

Suggested Fix:
Ensure that the buffer is read before any writing operations are performed. This will prevent the corruption of data and ensure that the deserialized information is accurate. Use the unsafe keyword judiciously to manage these operations, ensuring that the sequence of reading and writing to the buffer is correct.

#### Transaction error: Unknown

You may encounter an issue in which the proving operation is performed correctly and the transaction is sent to the node, but then it fails with `Transaction error: Unknown` and showing on rusk logs:

`rusk::chain::rusk: Tx ... executed with 2900000000 gas and err Some("Unknown")`.

The transaction has clearly been processed successfully as it can be seen by the gas being paid, but something went wrong while calling the contract. The recommendation would be to use the debug and host_debug features and litter the contract code with `dusk_core::abi::piecrust_debug` calls to see exactly where the contract crashes. If this doesn't yield results, then it is recommended to print out the result of inter-contract calls directly, just to see what error is actually being returned. The error is likely the result of an error on the host, which has to pass through the contract barrier before being returned as a response.

#### TokenAddress is just a [u8; 22]

If you're facing the following issue:
```rust
error[E0277]: the trait bound `for<'a> TokenAddress: Serialize<CompositeSerializer<BufferSerializer<&'a mut [u8]>, BufferScratch<&'a mut [u8; 64]>>>` is not satisfied
  --> src/lib.rs:45:5
   |
45 | /     dusk_core::abi::wrap_call(arg_len, |pk| {
46 | |         STATE.address_from_pk(pk)
47 | |     })
   | |______^ the trait `for<'a> Serialize<CompositeSerializer<BufferSerializer<&'a mut [u8]>, BufferScratch<&'a mut [u8; 64]>>>` is not implemented for `TokenAddress`
   |
   = help: the following other types implement trait `Serialize<S>`:
             <bool as Serialize<S>>
             <char as Serialize<S>>
             <isize as Serialize<S>>
             <i8 as Serialize<S>>
             <i16 as Serialize<S>>
             <i32 as Serialize<S>>
             <i64 as Serialize<S>>
             <i128 as Serialize<S>>
           and 162 others
note: required by a bound in `wrap_call`
  --> .cargo/registry/src/index.crates.io-6f17d22bba15001f/piecrust-uplink-0.11.0/src/abi/helpers.rs:26:1

error[E0277]: the trait bound `TokenAddress: Archive` is not satisfied
  --> src/lib.rs:52:5
   |
52 | /     dusk_core::abi::wrap_call(arg_len, |address| {
53 | |         let _ = STATE.check_address(address);
54 | |         1
55 | |     })
   | |______^ the trait `Archive` is not implemented for `TokenAddress`
```

The `rkyv` traits for the `TokenAddress` type need to be implemented, so that they are passable through the VM boundary automatically. The easiest way to do this is to derive them. Here's an example from implementing the traits for a `Note`:
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
