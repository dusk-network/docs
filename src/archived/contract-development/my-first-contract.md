---
title: Develop a contract
description: Create and Deploy smart contracts on Dusk. A step-by-step guide to building, compiling, and deploying your first smart contract on Dusk.
---

In this guide, we will create a counter contract that keeps track of its total count and provides functionality to increment this count by one and read the current value. The contract keeps track of how many times its increment method has been called, and this information can be accessed via a read method.

## Simple Counter Example

Let's create a simple smart contract for Dusk.

Let's do it step by step.

### 1) Create a Rust project

Smart contracts on Dusk are "almost" normal Rust programs, let's create a new Rust library project for this guide. This can be done with the following command:

```bash
cargo new --lib my-first-contract
```

This command will create a Rust library project in a folder named `my-first-contract`. You can open the project using your favorite [IDE](/developer/smart-contract/getting-started#ide) or with a simple system editor.

In the `src` folder there is a `lib.rs` file with some sample code. You can remove all the contents of the that file.

We will add the necessary dependencies to the `Cargo.toml` file. You can then start typing or pasting in the contract code.

### 2) Add dependencies

Add the following line to the dependencies section of your **Cargo.toml** file:

```toml
// Cargo.toml
[dependencies]
dusk-core = { git = "https://github.com/dusk-network/rusk/", branch = "master", features = ["abi-dlmalloc"] }
```

The `dusk-core` library exposes the application binary interface that allows you to communicate with the underlying Dusk VM.

### 3) Prepare the contract

The Rust contract is compiled to **WebAssembly** (WASM), and the standard library is not available for WASM. The reason for this is that WASM is platform agnostic and is not aware of certain operating system dependencies. Therefore certain system features won't be available in WASM due to its sandboxed environment (resulting in them not being available within the VM runtime).

Hence, first line of our contract will be:

```rust
// lib.rs
#![no_std]
```

:::tip[Info]
To still use some features we are used to from std, we can use [core](https://doc.rust-lang.org/core/) and [alloc](https://doc.rust-lang.org/stable/alloc/) where needed.
:::

Next, in order to use the features of the VM, we need to import a dusk-specific functionality using the standard Rust `use` declaration:

```rust
use dusk_core::abi::wrap_call;
```
This is needed later to expose the functions we want to make available for calling.

### 4) Add functionalities

We can now finally add our counter functionality. Let's define a new module within the ``lib.rs`` to keep it as a simple one-file for this guide. The module called "contract" will now encompass all the logic the contract needs to execute.

Within that module, we can create a struct, that represents our counter state:
```rust
// lib.rs
#![no_std]

use dusk_core::abi::wrap_call;

mod contract {
    pub struct Counter {
        pub value: u32,
    }
}
```

The value of our counter will be kept as a `value` field in the `Counter` struct. Since the couner struct is the representation of our state, which must be preserved between calls to contract methods, we now need to instantiate our state representation as an actual state.

This is done by a global static constant in the root module, just above `mod contract`. This constant is pointing to a single instance of the struct that represents our state:

```rust
use contract::Counter;

static mut STATE: Counter = Counter { value: 0 };
```

You can call the STATE and your struct however you like, but it makes sense to call the actual state `STATE` and name the data representation after the contract.

Now that we have our `STATE` of type `Counter`, we can continue implementing methods to manipulate it. 

#### Modify the contract state

Let's add a method to increment the counter by adding the following code:

```rust
impl Counter {
    pub fn increment(&mut self) {
        self.value += 1;
    }
}
```

#### Read from the contract state

We also need a method to read the counter value, so our `Counter` methods implementation block will look as follows:

```rust
impl Counter {
    pub fn read_value(&self) -> u32 {
        self.value
    }

    pub fn increment(&mut self) {
        self.value += 1
    }
}
```

We now have a Rust structure representing our state, and two methods: one to manipulate the state, and one to get the value of the state.
Together with this and the instantiated version of this state through the const, we are almost done with the contract.

#### Add an initializer

Similar to constructors for classes and the constructor in Solidity smart contracts, Dusk also supports such a mechanism. Upon deployment of a contract there can be an `init` **function** which will only be executed once during deployment.

Unlike constructors, this init function does **not** construct the struct, it executes any arbitrary initialization logic and is able to initialize the values within the already existing struct of the STATE constant.

This is particularly useful for state representations where values cannot be instantiated by the default function due to the const restriction, and manually typing the values in the STATE const lacks the ability to call other functions or logic, we can add an `init` function.

Another behaviour that is not otherwise possible is that the same contracts can be initialized on-chain with different data defined during the deployment transaction, which is close to the use case of a constructor.  In addition, there are cases where it becomes a necessity, allowing you to define more complex on-chain behaviour, such as accessing data from other deployed contracts during deployment, or calling other on-chain VM functions or contracts during deployment that are otherwise unavailable.

We don't need this behaviour in our contract, but will add it for the sake of completeness.

```rust
impl Counter {
    pub fn read_value(&self) -> u32 {
        self.value
    }

    pub fn increment(&mut self) {
        self.value += 1
    }

    pub fn init(&mut self, value: u32) {
        self.value = value;
    }
}
```

:::tip[Note]
If no argument to the init method was provided during deployment, the init method will be called with an empty argument. Since a deployment may execute some contract initialization code, that code will be metered and executed with the given `gas_limit`.

Additionally, the `init()` function can also only be called during deployment. 
:::

#### Expose functions

To be able to interact with the VM, the functions need to be exposed in a special way due to the contract being compiled as a WASM module. You may come across the phrase "we expose them to the host" when talking about this. You can look into [Core concepts](/developer/smart-contract/core-concepts) to learn more about what the host is.

To explain it briefly, it just allows the VM to "see" the methods and allow them to be invoked by a transaction on Dusk.

To achieve this, we need to add the following code in the root module, to expose the methods:

```rust
#[no_mangle]
unsafe fn read_value(arg_len: u32) -> u32 {
    wrap_call(arg_len, |_: ()| STATE.read_value())
}

#[no_mangle]
unsafe fn increment(arg_len: u32) -> u32 {
    wrap_call(arg_len, |_: ()| STATE.increment())
}

#[no_mangle]
unsafe fn init(arg_len: u32) -> u32 {
    wrap_call(arg_len, |arg: u32| STATE.init(arg))
}
```

This is the first case where we move away from standard rust. The `wrap_call` function is the one we imported earlier via `dusk_core::abi``.

:::tip[info]
The closure within ``wrap_call`` can be used to capture all arguments being passed to the function parameters, given a function contains any.
In our case above, there is no parameter being needed except for init. However, it could very well look like this, if the increment would let you define arguments that may affect the increment:

```rust
wrap_call(arg_len, |num: u32, multiply: u32| STATE.increment(num, multiply))
```
:::

**Additional Information**: 
- The `#[no_mangle]` annotations are needed in order to turn off the default name mangling of the Rust linker. We want our names to be as they are, since they will be called via mechanisms outside the control of the linker. More information on that can be found in [core concepts](/developer/smart-contract/core-concepts#no_mangle).
- `dusk_core::abi::wrap_call` takes care of all the boilerplate code needed to serialize/deserialize and pass arguments to and from our methods.

#### Add Serialization

Now that we have added an `init` function that takes arguments, we need to add serialization support. As explained in core-concepts already, this is done through rkyv on Dusk.

You can add another dependency to your cargo toml:
```toml
rkyv = { version = "0.7", default-features = false }
```

Now we just have to import rkyv Archive & Serialize and derive it on our state struct.

> **Thats it** 🎉 

Our contract is now complete, and the entire counter contract looks like this:

```rust
// lib.rs
#![no_std]

use dusk_core::abi::wrap_call;
use contract::Counter;

static mut STATE: Counter = Counter { value: 0 };

mod contract {
    use rkyv::{Archive, Serialize};

    #[derive(Debug, Archive, Serialize)]
    pub struct Counter {
        pub value: u32,
    }

    impl Counter {
        pub fn read_value(&self) -> u32 {
            self.value
        }

        pub fn increment(&mut self) {
            self.value += 1
        }

        pub fn init(&mut self, value: u32) {
            self.value = value;
        }
    }
}

#[no_mangle]
unsafe fn read_value(arg_len: u32) -> u32 {
    wrap_call(arg_len, |_: ()| STATE.read_value())
}

#[no_mangle]
unsafe fn increment(arg_len: u32) -> u32 {
    wrap_call(arg_len, |_: ()| STATE.increment())
}

#[no_mangle]
unsafe fn init(arg_len: u32) -> u32 {
    wrap_call(arg_len, |arg: u32| STATE.init(arg))
}

```
You can find the example counter contract in its final form with tests, added comments & additional tooling on our Github <a href="https://github.com/dusk-network/my-first-contract" target="_blank">here</a>.

### 5) Compile the contract

To learn how to compile the contract and read more about verifiable builds, you can jump straight to the [Compiling](/developer/smart-contract/guides/compiling) guide.

## A note on Contract State Persistence

After trying out the above example, you may wonder, how is it possible that the counter state is being persisted, although we did not do anything special with the count value. Usually, smart contracts provide persistence in a form of special key-value maps, accessible via an api provided by the contract host. Here, we did not do anything to make the count persistent, yet it is being persistent and when we try out the contract by subsequently calling `increment` and `read_value`, we can see that the count value is correct.. 

The answer is that the entire memory of a contract gets persisted, along with contract data. Thus, we don't need to do anything special to make data persistent. As data is in memory, it will persist along with the entire memory. A consequence of this is the fact that you can use any data structure or data collection in your program, and it will be persisted. You don't need to limit yourself to a predefined set of types provided to you by the blockchain's VM runtime environment.
