---
title:  Deploy on DuskEVM
description: Learn about the different ways of deploying smart contracts on DuskEVM.
---


Developers can deploy smart contracts on DuskEVM using Solidity and familiar tools like Hardhat or Foundry. This is a guide covering the essential information required to deploy smart contracts on DuskEVM.

Below, you can see the relevant information for each DuskEVM network:

| **Network** | **Chain ID**             | **RPC URL**                   | **Explorer URL**                           |
| ------- | -------------------- | ------------------------- | --------------------------------------- |
| Mainnet | `<PLACEHOLDER>` | `<PLACEHOLDER>`       | `<"PLACEHOLDER">`          |
| Testnet | `<PLACEHOLDER>` | `<PLACEHOLDER>`       | `<PLACEHOLDER>`  |


## 1) Install a development framework

Choose a development framework, such as:
- <a href="https://hardhat.org/" target="_blank">Hardhat</a>
- <a href="https://getfoundry.sh/" target="_blank">Foundry</a>

## 2) Fund your account with DUSK

Ensure your wallet is connected to the DuskEVM network and has been funded with some DUSK.

## 3) Configure your environment

Before deploying, make sure you use the correct configuration for DuskEVM deployment, including the correct chain ID and RPC endpoints.

If using Foundry, add DuskEVM's information to your `foundry.toml`:

```toml
rpc_url = "[PLACEHOLDER]"
chain_id = "[PLACEHOLDER]"
```

If using Hardhat, you can add DuskEVM in your `hardhat.config.js`: 

```js
module.exports = {
  networks: {
    duskEVM: {
      url: "<PLACEHOLDER>",
      chainId: "<PLACEHOLDER>",
    }
  }
};
```

## 4) Deployment

As DuskEVM is EVM-equivalent, you can use the foundry commands taking into account the different RPC endpoint (by using the `--rpc-url` flag) and your private key (using the `--private-key` flag):

If using Foundry, navigate to your project’s directory and launch: 

```
forge create src/{YourContract}.sol:{ContractName} --rpc-url "PLACEHOLDER" --private-key {YourPrivateKey}
```

If using Hardhat, add a deploy script in the scripts folder (e.g., add `scripts/deploy.js`), and then run it (e.g., with `npx hardhat run scripts/deploy.js --network duskEVM`).

# Further Resources

For full deployment workflows and advanced usage, refer to the official documentation of your preferred tool:

- <a href="https://hardhat.org/getting-started/" target="_blank">Hardhat documentation</a>
- <a href="https://getfoundry.sh/" target="_blank">Foundry documentation</a>