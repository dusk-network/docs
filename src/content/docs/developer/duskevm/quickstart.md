---
title: DuskEVM quickstart
description: Fund a testnet account and deploy a Solidity contract to DuskEVM.
---

Deploy a Solidity contract to DuskEVM Testnet with Foundry or Hardhat. DuskEVM uses the standard Ethereum JSON-RPC interface, so the workflow is the same one used for other OP Stack networks.

## Testnet

| Setting | Value |
|---|---|
| Chain ID | `745` |
| RPC | `https://rpc.testnet.evm.dusk.network` |
| Gas token | DUSK |
| Explorer | `https://explorer.testnet.evm.dusk.network` |

Confirm the RPC before signing:

```bash
cast chain-id --rpc-url https://rpc.testnet.evm.dusk.network

# 745
```

## 1. Fund the deployer

Create a dedicated EVM deployment account, then [bridge testnet DUSK to it](/learn/guides/duskevm-bridge/). Keep enough DUSK in the account to pay deployment gas.

Use an encrypted keystore or hardware signer. Do not place raw private keys in source files or shell history.

## 2. Deploy

### Foundry

Initialize a project and import the deployment key into Foundry's encrypted keystore:

```bash
forge init duskevm-quickstart
cd duskevm-quickstart
cast wallet import duskevm-testnet-deployer --interactive
```

Deploy the example `Counter` contract created by `forge init`:

```bash
forge create src/Counter.sol:Counter \
  --rpc-url https://rpc.testnet.evm.dusk.network \
  --account duskevm-testnet-deployer \
  --broadcast
```

### Hardhat 3

Initialize a Hardhat project with the viem toolbox, then add DuskEVM Testnet to `hardhat.config.ts`:

```ts title="hardhat.config.ts"
import hardhatToolboxViemPlugin from "@nomicfoundation/hardhat-toolbox-viem";
import { configVariable, defineConfig } from "hardhat/config";

export default defineConfig({
  plugins: [hardhatToolboxViemPlugin],
  solidity: { version: "0.8.28" },
  networks: {
    duskEvmTestnet: {
      type: "http",
      chainType: "op",
      chainId: 745,
      url: configVariable("DUSKEVM_TESTNET_RPC_URL"),
      accounts: [configVariable("DUSKEVM_TESTNET_PRIVATE_KEY")],
    },
  },
});
```

Store the configuration values in Hardhat's encrypted keystore:

```bash
npx hardhat keystore set DUSKEVM_TESTNET_RPC_URL
npx hardhat keystore set DUSKEVM_TESTNET_PRIVATE_KEY
```

Deploy the example Ignition module created by `npx hardhat --init`:

```bash
npx hardhat ignition deploy ignition/modules/Counter.ts \
  --network duskEvmTestnet
```

## 3. Confirm the deployment

Both tools print the deployed contract address. Confirm that the address contains bytecode:

```bash
cast code <CONTRACT_ADDRESS> \
  --rpc-url https://rpc.testnet.evm.dusk.network
```

The result should be longer than `0x`. Inspect the deployment transaction and contract in the [DuskEVM testnet explorer](https://explorer.testnet.evm.dusk.network/).

## 4. Verify the source

Open the contract in Blockscout and select **Verify & Publish**. Use the compiler version, optimizer settings, source files, and constructor arguments from the deployment build.

Blockscout also supports automated verification from [Foundry](https://docs.blockscout.com/devs/verification/foundry-verification) and [Hardhat](https://docs.blockscout.com/devs/verification/hardhat-verification-plugin).

Before deploying to mainnet, review the [DuskEVM network and compatibility reference](/developer/duskevm/reference/).
