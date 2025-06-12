---
title: Getting Started
description: Discover the essential tools, dependencies, and IDEs for developing smart contracts on Dusk.
---
## Dependencies

This page explains what dependencies you need to have installed on your computer to start writing smart contracts in Rust.

:::tip
The full list of dependencies and their versions can be found in the <a href="https://github.com/dusk-network/rusk/blob/master/README.md" target="_blank">Rusk</a> readme.
:::

### Rust

To start writing contracts in Rust we need installed <a href="https://www.rust-lang.org/tools/install" target="_blank">Rust</a> `1.75.0` nightly (nightly-2023-11-10). 

:::tip[Install Rust]
You can find information to install Rust <a href="https://www.rust-lang.org/tools/install" target="_blank">here</a>.
:::

#### Nightly

After having installed Rust, you can switch to the nightly toolchain. <a href="https://github.com/dusk-network/rusk" target="_blank">Rusk</a> makes use of the nightly toolchain, which can be installed with:
```bash title="Terminal"
rustup toolchain install nightly
rustup default nightly
```

### IDE

If you are new to Rust, you may wonder what are the most appropriate setups and IDEs.

Here you can find some information about the three popular setups: RustRover, VSCode with Rust Analyzer and Vim with Rust Analyzer.

#### VSCode + Rust Analyzer

<a href="https://code.visualstudio.com/" target="_blank">Visual Studio Code (VSCode)</a> is a widely-used code editor, on top of which extensions can be added. <a href="https://code.visualstudio.com/docs/languages/rust" target="_blank">Rust Analyzer</a> is an extension that significantly enhances Rust development within VSCode.

#### RustRover

<a href="https://www.jetbrains.com/rust/" target="_blank">RustRover</a> is an IDE from JetBrains tailored specifically for Rust development. It builds on the IntelliJ platform, providing an environment to streamline and enhance the Rust development process.

#### Vim + Rust Analyzer

<a href="https://www.vim.org/download.php" target="_blank">Vim</a> is a highly configurable text editor known for its efficiency and speed, which can be also paired with <a href="https://rust-analyzer.github.io/manual.html" target="_blank">Rust Analyzer</a>.
