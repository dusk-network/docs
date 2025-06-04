---
title: Troubleshooting
description: Learn how to solve issues when setting up a node on Dusk.
---

Here you can find answers explaining how to solve errors you may encounter.

#### kadcast::handling: NETWORK MISMATCH
This error occurs when one of the peers of your node is running on a different chain. You can safely ignore this error unless your node hasn't been upgraded correctly.

#### Consensus msg discarded: reason="too far in the future"
You can use the `--network=host` flag to resolve networking problems.

#### Unable to resolve domain:  invalid socket address
Such errors usually indicate DNS problems. Check your DNS settings.

#### What should I do if the ruskreset command aborts?
When prompted:

`WARNING: This operation will DELETE your Rusk state, wallet cache, and logs.
Are you sure you want to proceed? (Y/n):`

Answer with a capital **Y**, otherwise the operation will abort.

#### PersistenceError(Os { code: 2, kind: NotFound, message: "No such file or directory" })
Run the `ruskreset` command to fix this.

#### "stake" command not recognized
If staking via Moonlight, you can launch:

```bash
rusk-wallet moonlight-stake --amt 3000
```

#### Serialization error
First, wait for your node to be fully synced. If the node is running fine, use the following command for further details:
```bash
rusk-wallet --log-level debug
```

#### Connection to Rusk Failed, some operations won't be available
This error is expected on the first installation because the node isn't up yet. 

Anyways, ensure you properly followed the instructions and that you are using the latest version and check the logs for further details.

```bash
ruskquery version
```

```bash
tail -F /var/log/rusk.log -n 50
```

#### Port conflicts when running multiple services
You can use the following to identify what's running on the conflicting port (e.g., 8080) and resolve the issue:

```bash
netstat -tuplen
```

You can also verify if something else is running on port 8080 by running:

```bash
curl -s --request POST "http://127.0.0.1:8080/on/node/info"
```
If you receive a **404 page not found** response, another service is using that port.

#### "chain.stalled" error
This indicates your node cannot process blocks due to:

Port not being forwarded or incorrect Kadcast address in `/opt/dusk/services/rusk.conf.default`.
To fix the issues, you should ensure the required ports (9000/udp, 8080/tcp) are accessible and verify that the `kadcast_address` is correct.
To check the state of your node, you can run:

```bash
rusk-wallet stake-info
```

#### "Invalid Data" or "500 Internal Server Error" during staking
Ensure you're using the latest version of `rusk-wallet`. Update by cloning the repository and reinstalling:

```bash
cargo install --path rusk/rusk-wallet
```


#### "PersistenceError" caused by "InvalidData" or "pointer out of bounds"
These errors indicate that your node's state is corrupted. To fix this, reload from a snapshot by running:

```bash
download_state
```
(and confirm the warning by typing 'Y'). Then, restart the node with:

```bash
service rusk start
```


#### Compilation errors on libraries when building rusk-wallet
Check if you are launching `make` from the root of the **rusk** directory (instead of another directory, such as **rusk-wallet**). The binary will be found in `./rusk/target/release/rusk-wallet`.