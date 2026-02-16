---
title:  Deploy on DuskEVM
description: Learn about the different ways of deploying smart contracts on DuskEVM.
---

Developers can deploy smart contracts on DuskEVM using Solidity and familiar tools like Hardhat or Foundry. This is a guide covering the essential information required to deploy smart contracts on DuskEVM.

Below, you can see the relevant information for each DuskEVM network:

| **Network** | **Chain ID**             | **RPC URL**                   | **Explorer URL**                           |
| ------- | -------------------- | ------------------------- | --------------------------------------- |
| Mainnet | `744` | `https://rpc.evm.dusk.network`       | `https://explorer.evm.dusk.network`          |
| Testnet | `745` | `https://rpc.testnet.evm.dusk.network`       | `https://explorer.testnet.evm.dusk.network`  |


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
[rpc_endpoints]
dusk_evm_mainnet = "https://rpc.evm.dusk.network"
dusk_evm_testnet = "https://rpc.testnet.evm.dusk.network"
```

If using Hardhat, you can add DuskEVM in your `hardhat.config.js`: 

```js
module.exports = {
  networks: {
    duskEvmMainnet: {
      url: "https://rpc.evm.dusk.network",
      chainId: 744,
    },
    duskEvmTestnet: {
      url: "https://rpc.testnet.evm.dusk.network",
      chainId: 745,
    }
  }
};
```

## 4) Deployment


If using Foundry, navigate to your project’s directory and launch: 

```
forge create src/{YourContract}.sol:{ContractName} --rpc-url dusk_evm_testnet --private-key {YourPrivateKey}
```

If using Hardhat, add a deploy script in the scripts folder (e.g., add `scripts/deploy.js`), and then run it (e.g., with `npx hardhat run scripts/deploy.js --network duskEVM`).

## Further Resources

For full deployment workflows and advanced usage, refer to the official documentation of your preferred tool:

- <a href="https://hardhat.org/getting-started/" target="_blank">Hardhat documentation</a>
- <a href="https://getfoundry.sh/" target="_blank">Foundry documentation</a>
