---
title: Provers
description: Learn about Dusk Provers for generating zero-knowledge proofs within Dusk.
---

Provers carry on the computation-heavy task of creating Zero-Knowledge proofs (ZKP), which are a requirement for privacy-preserving transactions on Dusk and for certain ZK-powered applications.

Provers are specialized nodes responsible for handling the computationally intensive task of creating [Zero-Knowledge Proofs](/learn/deep-dive/cryptography/zkp). These proofs are essential for enabling the privacy-preserving feature of the [Phoenix](/learn/deep-dive/duskds-tx-models) transaction model. Given the high computational demands of ZKPs, configuring a Prover with the right specifications is crucial to ensure optimal performance.

:::tip[Run a Prover]
If you want to run a prover, you can run a [provisioner](/operator/provisioner), which includes the prover.
:::

## Prover Specifications

The performance of a Prover largely depends on the number of workers that the server can manage simultaneously. Since generating ZK proofs is a single-threaded process, having strong single-core performance is vital to complete proofs efficiently and reduce transaction finalization time.

**Minimum**

| CPU             | RAM  | Storage | Network Connection |
| :-------------- | :--- | :------ | :----------------- |
| 4 cores; +2 GHz | 8 GB | 20 GB   | 20 Mbps            |

**Per Worker**

The specifications listed below are per worker.

| CPU            | RAM  | Storage | Network Connection |
| :------------- | :--- | :------ | :----------------- |
| 1 core; +2 GHz | 1 GB | 2 GB    | 5 Mbps             |
