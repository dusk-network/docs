---
title: IOP and PCS
description: Learn about Interactive Oracle Proofs (IOPs) and Polynomial Commitment Schemes (PCS) and their use in Dusk.
---

By combining cryptography with interactive proofs, we obtain a succinct non-interactive arguments of knowledge (SNARK).

To do so, we need a cryptographic object called Polynomial Commitment Scheme and an information-theoretic one called Interactive Oracle Proof.

The current paradigm on how to build an efficient snark for general circuits is to have:

- A **Polynomial Commitment Scheme** (PCS). The PCS is a cryptographic object, and its security depends on its cryptographic assumptions.
- An **Interactive Oracle Proof** (IOP), compatible with the PCS. Because the IOP is an information-theoretic object, we can prove its security without underlying assumptions.

The reason why this is considered a “modern” way to construct SNARKs, is because the IOP construction has been separated from the PCS construction, introducing the flexibility that paved the way for important innovations.

## Polynomial Commitment Schemes (PCS)

Before understanding what a PCS is, let’s first recap what a commitment scheme is.

A commitment scheme is a protocol that needs to satisfy the following propriety(ies):

- **Binding propriety**: it cannot produce two opening values for the commitment string. In other words, one commitment can only be “tied” to just one message.
- **Hiding propriety** (in the case of ZK proofs). The committed string cannot reveal anything about the committed data.

To have a commitment scheme, we need a commitment algorithm and a verifier algorithm.

- **Commit algorithm**: allows to commit a message to a random value. The output commitment string is very short (e.g. 32bytes), and its inputs are the message and the random value.
- **Verifier algorithm**: runs by having as input the message, the commitment string, and the random number.

As most commitment schemes use hash functions, the trivial commitment scheme would be to use a hash function and commit to the coefficients of the polynomial.

Anyways, in the context of a Zero Knowledge Proof, this would mean that the prover would need to send a proof that includes all the coefficients of the polynomial. As the polynomial can be extremely big, the proof would not be succinct though. Because we need succintness to construct a SNARK, it is necessary to use a Polynomial Commitment Scheme (PCS).

A Polynomial Commitment Scheme (PCS) is a cryptographic protocol that is able to transform a polynomial IOP into a succinct argument of knowledge. The PCS allows the prover to simulate the polynomial IOP without explicitly sending a description of a large polynomial to the verifier.

This is possible because what the verifier receives is only a commitment to the polynomial (e.g. a hash value of an element of a cryptographic group), and not the full description of the polynomial. As PCS supports the functionality that allows the verifier to choose a random point and demand that the prover evaluates the polynomial at that point, the verifier is convinced about the legitimacy of the proof after enough evaluations.

By using a PCS, the Verifier does not need the complete description of the polynomial, but instead:

- Receives a single hash value (or cryptographic group element) that commits to the polynomial.
- Receives the requested evaluation of the polynomial and a proof that the requested evaluation of the polynomial is correct.

The PCS allows for running the IOP succinctly, as the prover doesn’t need to send the whole polynomial to the verifier, but only a commitment to it.

The PCS reduces the claim over the correctness of the circuit to the evaluation of polynomials (which can be error-correcting schemes, hash-based schemes, additive groups schemes..).

The reason why it is enough to send a commitment to the polynomial to the Verifier (instead of its whole description), is that the verifier doesn’t really care about the polynomial itself, but only about doing evaluations on it.

For this reason, the verifier only needs evaluation points and be able to query their evaluations. In practice, the verifier treats the queries to the polynomial commitment as “oracles”. The verifier needs the concept of an “oracle” so that he can query the evaluations from it. The way an oracle can be provided to the verifier is by instantiating the oracle into a Polynomial Commitment Scheme (PCS). The reason an oracle needs to be “instantiated” is because an oracle is just an information-theoretic concept: it doesn’t actually exist in practice. Because the oracle is an abstract model, we need to encode the polynomials in order to use it.

## Interactive Oracle Proof (IOP)

An Interactive Oracle Proof (IOP) is a theoretical object that provides interactive proofs, which are the result of having both interactions and randomness. 

An IOP provides the interaction between the prover and verifier, and demonstrates that a given circuit C equals to zero for a given public statement x and private witness w. In other words, the IOP is an interactive proof system that proves C(x,w)= 0.

The IOP consist of “oracles”, which are expected to give the correct value when they are queried. In this theoretical framework, the verifier’s parameters consist of oracles that can be queried. The nature of oracles is information-theoretic, and they don't introduce any security assumption. Anyways, because of their "abstract" nature, they don’t actually exist until they are instantiated (for example through a PCS)

In order to be used, oracles are therefore replaced by commitments that the verifier can evaluate at any point of his choice.

The prover sends oracles to the verifier and the verifier can query those oracles and send challenges in the form of random field elements (bits) to the prover. This exchange continues for several rounds until the prover sends the last oracle.

An IOP allows us to have an interactive protocol that works the following way:

- Verifier sends random bits to the prover
- Prover Sends the oracle to a function
- Verifier sends other randomness to the prover
- Prover sends an oracle to another function to the verifier
- The above steps happen for several rounds until the prover sends the last oracle for the last function.
- Verifier uses the verification procedure to either accept or reject the proof.

Combining the IOP with the PCS enables the construction of a SNARK..

## Pre-processing (setup)

As both the prover and verifier algorithm take parameters as inputs, these parameters need to obtained via a pre-processing step (called "setup"). The setup procedure is a key step that allows to obtain the parameters for both prover and verifier algorithms.

Let's first understand why this procedure is so important.

##### Succinctness and polynomial's description

If a circuit has a number of gates **d**, the polynomial would have at most a degree **d**. An important thing to note is that the verifier will need to have enough time to read the circuit if he wants to be able to verify the proofs. Allowing the verifier to read the circuit would mean that the verifier algorithm would need to run in linear time to the size of the circuit, which is a problem. Because the polynomial used to represent the circuit with can be huge (e.g. a degree of 1 billion) if the verifier algorithm was running in linear time to the size of the circuit, the proof wouldn't be succinct.

To have a SNARK, the verifier algorithm to operate in a logarithmic time in the size of the circuit `C`, enabling succinctness. Anyways, the issue we encounter by having the verifier algorithm operating in logarithmic time, is that the verifier doesn’t have enough time to know what the circuit looks like. This is a problem because the verifier is tasked with dealing with the polyonmial without knowing the full description of it.

To solve this issue, the verifier needs to have at least the summary of polynomial, so that he is able to evaluate it at the chosen points. By giving the verifer parameters that can function as a summary of the circuit, we obtain a succinct proof (as the proof size and verifier time becomes logarithmic in the degree of the polynomial). 

We do so by a pre-processing step, which leverages the PCS to let the prover commit to the polynomial by using a very short string.

The pre-processing step is important, because it’s the algorithm that generates parameters for both the prover and the verifier, allowing the verifier to operate in a logarithmic time in the size of the circuit.

With the pre-processing step, the Verifier can work on a summary of the circuit and verify evaluations at arbitrary points without needing to know the full description of the circuit. The pre-processing steps involve an algorithm that takes as an input the circuit `C` and some randomness (random bits). The short summary of the circuit is represented via a string, and the verifier is able to know a summary of the circuit through that string.

##### Algorithms and inputs
The pre-processing argument system takes in 3 algorithms: the setup, the verifier, and the prover algorithms. 

When it comes to inputs, the Prover takes the Prover’s public parameters, the witness, and the statement. The Verifier takes the Verifier’s public parameters, the proof, and the statement.

## How to constructing a zk-SNARK

The following process outlines how to construct a "modern" zk-SNARK.

##### 1) Choose functions
First, we choose a finite field for some prime number. Basically, we are fixing a set of functions.

##### 2) Write an arithmetic circuit

In order to represent the computation via polynomials, we need to write an arithmetic circuit using the choosen finite field. The circuit would take as inouts a public statement and a private witness. The circuit would output some elements in the finite field. The arithmetic circuit has additions and multiplications gates, and the circuit takes as inputs a statement x and a witness w. This way, we can compile the computation into a SNARK-friendly format (e.g. PLONK) as we obtain an argument system.

##### 3) Pre-process the circuit
To make sure that the final proof is succinct, we need to pre-process the circuit with a setup algorithm. The setup algorithm takes a description of the circuit as input and outputs the public parameters for the Prover and Verifier. This allows us to pre-process the circuit. To be specific, the parameter for the verifier is a commitment to a bunch of polynomials. This is where the Fiat-Shamir transformation comes into play: it is the step that allows us to deal with non-interactive proof systems instead of interactive ones. The setup algorithm outputs some global parameters that are used by the verifier and prover. For non-interactive systems the pre-processing step is necessary, as this allows the prover to just send the proof without any additional interactions.

##### 4) Choose algorithms and use the parameters
Once having chosen the prover and verifier algorithms, the public parameters need to be fed into the snark backend prover system (e.g. a prover would be running something like Groth16, Plonk, Bulletproofs..).

##### 5) Prover / Verifier interaction
The prover wants to prove that he can calculate `f(x) = y` . The prover also wants to prove that the function f is included in the specific domain (the set of functions we have chosen previously).

In other words, the Prover wants to prove that for a circuit `C` and a statement `s`, he knows a witness w such as that the circuit is equal to `0`, which in short means `C(s,w) = 0` . The witness in this case is the description of the function f along with the randomness r. Hopefully, the proof is short enough (e.g. few KBs).

The first message in the protocol is the commitment to a polynomial sent from the Prover to the Verifier. To send the first message, the Prover chooses a function in the set and commits to it by running the commit algorithm. The commit algorithm outputs a commitment string, which is then used as a commitment to the global parameters, the selected function, and the randomness. This first message is important because it specifies the polynomial that the Prover committed to. After this first message, the interactive procedure starts.

**Interactive procedure**

The interactive procedure corresponds to the evaluation protocol, which allows interactions between the Prover and the Verifier. In this interactive procedure, the messages from the Prover are short and read by the Verifier in full.
This procedure involves a series of rounds where:
- The verifier chooses a random point in the finite field and asks the Prover to evaluate the polynomial on that random point. In other words, the verifier asks the Prover to “open” the selected polynomial at a specific point.

- The prover needs to evaluate the polynomial on the point chosen by the Verifier so that he can prove that he knows how to evaluate the function he committed to. The prover sends back the evaluation, along with the proof that the evaluation is correct.

- The prover commits to another polynomial and sends the commitment to the verifier.

- The verifier chooses another random value and sends it to the prover.The verifier can ask the prover to open any of these polynomials at any point of the verifier’s choice.

- The prover evaluates the polynomial at the new point and provides the Verifier with both the new evaluations and the new proof that the evaluation is correct. 

**Interactive rounds**

These steps are repeated for several rounds, as this is a continuous interaction between the prover and verifier. Anyways, when using the Fiat-Shamir transformation, the interaction becomes non-interactive by being simulated via hashes obtained by an initial randomness provided by the verifier. 

##### 6) Final Round
After a certain number of interaction, the prover commits to the last polynomial and sends the commit. The verifier then chooses whether to accept or reject the proof, by taking as inputs the statement, the random values, and the evaluations of the polynomials at all the points that he chooses. By committing to the polynomial, he is providing a succinct proof that he knows a witness (the function description and a randomness)such that `f(x)=y` .

## Wrap-up

In summary, to build a SNARK, we parametrize the polynomial IOP by two parameters:

- The number of polynomial commitments.
- The number of evaluation queries from the verify algorithm (the number of points at which the prover needs to open the polynomial).

We instanciate the IOP via a PCS, constructing the final zk-SNARK by using several polynomial commitments + several evaluation proofs.
The zk-proof is verified by having the prover sending the polynomial commitments to the verifier, which then runs the evaluation queries several times.
