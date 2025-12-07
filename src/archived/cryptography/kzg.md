---
title: KZG
description:  Learn about KZG commitments and how they are used with the PLONK proving system.
---

One of the Polynomial Commitment Scheme that is usually combined with the PLONK IOP is the <a href="https://www.iacr.org/archive/asiacrypt2010/6477178/6477178.pdf" target="_blank">KZG</a> one. This PCS is quite fast and has interesting properties, and requires a trusted setup and pairings.

After running the setup procedure to obtain the global parameters needed for the setup procedure, the toxic waste needs to be deleted. As KZG relies on a trusted setup, Multi-Party Computation is often used in trusted setups so that the need for trust is minimized.

The prover uses the global parameters to commit to the polynomial by using its coefficient form. The commitment is binding commitment but not hiding (as we have revealed some information about the polynomial).

Because the proof is the commitment to the quotient polynomial, the prover needs to compute the quotient polynomial and commit to it. As the prover commits to it by committing to a single group element, the proof has a constant size and does not depend on the degree of the polynomial. The fact that the proof size is constant (and does not depend on the circuit size), is the main reason why the KZG scheme is so popular.

## KZG's Proprieties

KZG scheme has few interesting proprieties:
- Can be generalized to commit also to multivariate polynomials (polynomials with multiple variables), in addition to the univariate ones.
- Supports batch proofs. If the prover needs to commit to several polynomials, he can batch those proofs into a single group element (by opening multiple polynomials at multiple points).
- Supports linear-time commitments. This means that the time for the prover to commit to the polynomial is linear in the degree of the polynomials.

In Dusk, there is no such thing as off-chain proof creation and on-chain verification. Transactions itself are zk-proofs which are processed by Prover nodes and then appended on-chain. Dusk uses <a href="https://github.com/dusk-network/plonk/blob/372319e33476daf44334c9a845dbb983ff26bb5e/src/commitment_scheme.rs#L17" target="_blank">KZG</a> commitments because of the small size of the proofs, making it feasible to append them on-chain.
