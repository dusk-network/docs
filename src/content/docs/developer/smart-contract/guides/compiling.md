---
title: Compile a contract
description: Compile Dusk smart contracts and ensure verifiable builds for secure and transparent deployments
---

This page is about compiling smart contracts and what verifiable builds are. Verifiable builds are particularly important for smart contracts as it is necessary to reproduce every single step in order to verify a contract's compiled bytecode against the supplied source code or project to ensure that they are exactly the same.

## Compile a Contract

Make sure you added the following line in the `[lib]` section of your `Cargo.toml`:

```toml
[lib]
crate-type = ["cdylib", "rlib"]
```
:::tip[Info]
The `cdylib` type ensures that the necessary metadata and structure for a dynamic library are included in the output file. Without adding it, the Rust compiler would default to other types that are not suitable for dynamic loading (needed by WebAssembly hosts). This implies that the build process may still proceed without errors, but it will not produce a WebAssembly file that can be recognized by WebAssembly hosts. In other words, without adding the `cdylib` line you won't be able to see the `.wasm` file just created.
:::

To compile `#![no_std]` Rust code to WASM we need to follow the following steps:

### 1. Install wasm-pack

To build the WASM contracts, `wasm-pack` is required:

```bash title="Terminal"
cargo install wasm-pack
```

### 2. Set the right rust version

Make sure that you use version ``1.75.0-nightly`` of rustc. This can be achieved by having a ``rust-toolchain.toml`` file in your project or have set the rustc compiler to the following:

```toml
// rust-toolchain.toml
[toolchain]
channel = "nightly-2023-11-10" # 1.75.0-nightly
targets = ["wasm32-unknown-unknown"]
components = ["rust-src", "rustfmt", "cargo", "clippy"]
```

This ensures compatibility with the `dusk-core` dependency in your contract.

For the full list of dependencies, please look at the <a href="https://github.com/dusk-network/rusk/blob/master/README.md" target="_blank">Rusk</a> readme.

### 3. Add the wasm target

If you have not yet added the wasm32 target to Rust, you can add it with the following command:

```bash title="Terminal"
rustup target add wasm32-unknown-unknown
```

### 4. Specify the target explicitly

You can pass a target flag to the cargo build command, to explicitly set the target you want to compile to. This command compiles the Rust project to WebAssembly in release mode, optimizing the output for performance.

```bash title="Terminal"
cargo build --target wasm32-unknown-unknown --release -Znext-lockfile-bump
```

:::tip[Note]
Often it is easiest to create a Makefile for the contracts which takes care of the build and test process. An example Makefile can be found in the [Cheat sheet](/developer/smart-contract/cheat-sheet#example-makefile-to-compile-to-wasm) page.
:::

<!-- Another way of compiling is also possible with wasm-pack by using
```bash
wasm-pack build
```
For this you need to specify an additional dependency in your projects ``Cargo.toml`` file called [wasm-bindgen](https://crates.io/crates/wasm-bindgen).
-->

Once the contract has been compiled successfully, you can execute in your cli:

```bash title="Terminal"
find . -name "*.wasm"
```

By doing so, you should see the build file named: `your_contract_project_name.wasm`.

Now that you have compiled the contract, you can [deploy](/developer/smart-contract/guides/deploying) it to the Dusk blockchain.

## Verifiable Builds

For deterministic and verifiable builds, use our Dockerized build environment, which guarantees identical outputs. This is the easiest way to ensure your smart contract builds can be reproduced by others.

### Pull the Docker Image

Use the prebuilt Docker image:

```bash
docker pull dusknode/dusk-verifiable-builds:0.2.0
```

### Run the Build Command

Replace `<path-to-contract-code>` and `<path-to-output-folder>` with the appropriate paths to your contract source code and output directory:

```bash
docker run --rm \
    -v <path-to-contract-code>:/source \
    -v <path-to-output-folder>:/target \
    dusknode/dusk-verifiable-builds:0.2.0
```

After running this command, the compiled `.wasm` files will be available, depending on your build target, in:
- `/target/final-output/wasm32`
- `/target/final-output/wasm64`

### Verify the Output

To ensure your contract has compiled correctly, locate the `.wasm` files:
```bash
find <path-to-output-folder> -name "*.wasm"
```

### Reproduce the Build

Share the Docker image and your source code with auditors or collaborators to enable them to reproduce the same build.
