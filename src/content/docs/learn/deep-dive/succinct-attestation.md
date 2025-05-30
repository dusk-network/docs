---
title: Succinct Attestation Consensus
description: Understand the innovative consensus mechanism that secures Dusk.
---

The Dusk consensus protocol, called **Succinct Attestation** (**SA**), is a permission-less, committee-based proof-of-stake consensus protocol.

The protocol is run by all stakers, known as ***provisioners***, which are responsible for generating, validating, and ratifying new blocks. Participation goes in turns, with provisioners being pseudo-randomly selected for each phase of the consensus. The selection is done through the [*Deterministic Sortition*](#deterministic-sortition) algorithm, which extracts provisioners in a non-interactive way based on their stakes: the higher the stake, the more the provisioner gets extracted.


## Consensus Algorithm

The SA protocol is run in ***rounds***, with each round adding a new block to the blockchain. In turn, each round proceeds per ***iterations***, with each iteration aiming at generating a new *candidate* block and reaching agreement on the validity and the acceptance of such a block.

An iteration is composed of three ***steps***:
  1. [***Proposal***](#proposal), where an extracted provisioner is appointed to generate a new block and broadcast it to the network.
  2. [***Validation***](#validation), where a committee of extracted provisioners verifies the new block and vote on the result.
  3. [***Ratification***](#ratification), where another committee of provisioners try to agree on the result of the Validation step.

If a candidate is produced in the Proposal step, and a supermajority of votes is reached in favor of the block, the candidate is added to the blockchain. The result of the iteration is certified with an ***attestation*** containing all the (digitally-signed) votes of the committee members that reached agreement on the block.

When an iteration fails to produce and reach consensus on a block, a new one is executed with a new block generator (which means a different candidate block) and a new set of voters. To mitigate the risk of forks, when a provisioner starts a new iteration, it stop participating on previous ones. A maximum of 50 iterations is run in a single round.

### Emergency Mode
After 16 failed iterations, the consensus enters the *Emergency Mode*, in which iterations are kept active until either they reach a result (i.e., either a *success* or a *fail* quorum) or a block is accepted. Extracted provisioners are allowed to participate to all emergency-mode iterations at the same time, increasing the risk of forks but maximizing the probability of producing a block.

### Open Mode
If a node reaches the end of the last iteration without an accepted block, it enters the *Open Mode*, in which all currently-active emergency-mode iterations are kept running, but no new ones are started. In other words, in Open Mode, nodes wait for missing nodes to rejoin the network and reach consensus on one of the iterations.

### Emergency Block
In extreme cases, in which a large amount of provisioners is failing to participate and no block is produced, an *Emergency Block* can be produced by one of the nodes run by Dusk. This block needs no validation nor consensus and is automatically accepted by all nodes. Consensus will then start from the following round following the standard rules. Note that the Emergency Block can be replaced by a proper block if produced before reaching Rolling Finality (see the *Finality* section below).

## Deterministic Sortition

The *Deterministic Sortition* procedure allows to deterministically select the *block generator* and the *voting committees* for each consensus iteration. 

Specifically, this procedure is run for each consensus step to assign a number of *credits* (1 in the Proposal step, and 64 in the Validation and Ratificaiton steps) to eligible provisioner[^1] extracted in a pseudo-random way.

Pseudo-randomness is based on a hash function and a unique cryptographic *seed* that is inserted in the block by the block generator and computed by digitally signing the seed in the previous block. This seed-generation method is designed to prevent malicious actors from predicting future-round generators and voters[^2].

In a sortition, each provisioner can be assigned one or more credits, depending on their stake. In particular, the algorithm follows a weighted distribution where the probability of extraction is directly proportional to the stake amount (the bigger the stake, the higher the probability of being extracted).

Therefore, on average, eligible provisioners will participate in committees with a frequency and power proportional to their stakes.

With respect to Validation and Ratification, votes from provisioners will count proportionally to the number of credits assigned to the voter by the sortition. In other words, provisioners with more credits will have more weight in reaching a Quorum (and earning rewards).

### Extraction

Each credit is assigned by running an extraction procedure. This procedure is based on the provisioners' stakes and a *score* value computed at each extraction.

Stakes are used to assign a weight to each provisioner participating in the extraction. Specifically, at the beginning of the sortition procedure, provisioners are assigned a weight equal to their stake value.

Instead, the score is obtained by hashing the round, iteration, and step numbers with the current seed and the number of the credit to assign.

The extraction then proceed by iterating over provisioners and subrtracting weights from the score until a provisioner with weight higher than the current score is found. This provisioner will be extracted and assigned the credit.

To balance out probabilities for the sortition, each time a provisioner is assigned a credit, its weight is reduced by 1 DUSK (thus diminishing its probability of extraction).


## Proposal

*Proposal* is the first step in an SA iteration. In this step, a randomly-extracted provisioner is appointed to generate a new *candidate* block to add to the ledger. In the same step, other provisioners wait for the candidate block produced by the generator.

In the proposal step, each provisioner node first executes the [*deterministic sortition*](#deterministic-sortition) algorithm to extract the *block generator*. If the node is selected, it creates a new *candidate block*, it signs it and broadcasts it using a $\mathsf{Candidate}$ message.

In this step, all other nodes wait to receive the candidate block until a timeout expires. If it was generated or received from the network, the step outputs the candidate block; otherwise, it outputs a void value. The step output will then serve as the input for the [*validation*](#validation) step, where a committee of provisioners will verify its validity and vote accordingly.

## Validation

*Validation* is the second step in an SA iteration. In this step, the *candidate* block, produced or received in the [proposal](#proposal) step, is validated by a committee of randomly chosen provisioners. Members of the extracted committee verify the candidate's validity and then cast their vote accordingly. At the same time, all provisioners, including committee members, collect votes from the network until a target quorum is reached, or the step timeout expires.
The main purpose of the validation step is to agree on whether a candidate block has bee produced and if it is a valid new tip of the blockchain.

In the validation step, each provisioner first executes the [*deterministic sortition*](#deterministic-sortition) algorithm to extract the committee for the step. The validation committee is generated by assigning 64 credits among all provisioners, except the block generator (which can thus not vote for its own block).

If the provisioner is part of the committee, it validates the output from the [proposal](#proposal) step. If the output is void, it votes $NoCandidate$. Otherwise, it verifies the candidate block's validity against its previous block: if the candidate is valid, the node votes $Valid$, otherwise, it votes $Invalid$.
Non-valid votes are used to prove an iteration failed (i.e., it can't reach a quorum of $Valid$ votes), which is functional to [block finality](#finality). The vote is signed and broadcast using a $\mathsf{Validation}$ message.

Then, all provisioners, including the committee members, collect votes from the network until a *supermajority* ($\frac{2}{3}$ of the committee credits) of $Valid$ votes is reached, a *majority* ($\frac{1}{2}{+}1$) of $\text{non-}Valid$ votes is reached, or the step timeout expires.
Specifically, if a supermajority of $Valid$ votes is received, the step outputs $Valid$; if a majority of $Invalid$ or $NoCandidate$ votes is received, the step outputs $Invalid$ or $NoCandidate$, respectively.

If the step timeout expires, the step outputs $NoQuorum$, which represents an unknown result: it is possible that casted votes reached a quorum but the provisioner did not see it.

In all cases, except $NoQuorum$, the step output includes the aggregated votes that determined the result. The step output will be used as the input for the [ratification](#ratification) step.

## Ratification

*Ratification* is the third step in an SA iteration. In this step, the result of the [validation](#validation) step is agreed upon by another committee of randomly chosen provisioners. 
Members of the extracted committee cast a vote with the output of the validation step. At the same time, all provisioners, including committee members, collect Ratification votes from the network until a target quorum is reached or the step timeout expires.

If a quorum is reached for any result, a $\mathsf{Quorum}$ message is generated with the aggregated signatures of both validation and ratification steps.
Since the certificate proves a candidate reached a quorum, receiving this message is sufficient to accept the candidate into the local chain.

The main purpose of the Ratification step is to ensure provisioners are "aligned" with respect to the validation result: if validation result was $Valid$, it ensures a supermajority of provisioners accept the block. Similarly, in case of non-Valid result, it ensures a majority of provisioners will attest this iteration as failed, which, in turn, is used in determining the block [*finality*](#finality).

In the ratification step, each provisioner first executes the [*deterministic sortition*](#deterministic-sortition) algorithm to extract the committee for the step. The ratification committee is also generated by assigning 64 credits among provisioners.
If the provisioner is part of the committee, it casts a vote with the winning validation vote ($Valid$, $Invalid$, $NoCandidate$, $NoQuorum$). 
The vote is signed and broadcast using a $\mathsf{Ratification}$ message, which also include the validation votes that determined the result.

Then, all nodes, including the committee members, collect votes from the network until a *supermajority*  ($\frac{2}{3}$ of the committee credits) of $Valid$ votes is reached, a *majority* ($\frac{1}{2}{+}1$) of $\text{non-}Valid$ votes is reached, or the step timeout expires. 

If any quorum is reached, the step outputs the winning vote ($Valid$, $Invalid$, $NoCandidate$). Otherwise, if the step timeout expires, the step outputs $NoQuorum$.
In all cases, except $NoQuorum$, the output of the step includes the aggregated votes that determined the result.

The output, together with the validation output, will be used to determine the outcome of the iteration.

## Finality

Due to the asynchronous nature of the network, more than one block can reach consensus in the same round (but in different iterations), creating a chain *fork* (i.e., two parallel branches stemming from a common ancestor). This is typically due to consensus messages being delayed or lost due to network congestion.

When a fork occurs, network nodes can initially accept either of the two blocks at the same height, depending on which one they see first. 
However, when multiple same-height blocks are received, nodes always choose the lowest-iteration one. This mechanism allows to automatically resolve forks as soon as all conflicting blocks are received by all nodes.

As a consequence of the above, blocks from iterations greater than 0 could potentially be replaced if a lower-iteration block also reached consensus. Instead, blocks reaching consensus at iteration 0 can't be replaced by lower-iteration ones with the same parent. However, they can be replaced if an ancestor block is reverted.

To handle forks, we use the concept of consensus state, which defines whether a block can or cannot be replaced by another one from the network.
In particular, blocks in the local chain can be in three states:

  - *Accepted*: the block has a $Valid$ quorum but there might be a lower-iteration block with the same parent that also reached a $Valid$ quorum; an Accepted block can then be replaced by a lower-iteration one; *Accepted* blocks are blocks that reached consensus at Iteration higher than 0 and for which not all previous iterations have a Failed Attestation. 

  - *Attested*: the block has a Valid quorum and all previous iterations have a Failed Attestation; this block cannot be replaced by a lower-iteration block with the same parent but one of its predecessors is Accepted and could be replaced; blocks reaching quorum at iteration 0 are Attested by definition (because no previous iteration exists).
  
  - *Final*: the block is attested and all its predecessors are final; this block is definitive and cannot be replaced in any case.

## Global Parameters

| Name                      | Value            |
|:-------------------------:|:----------------:|
| Minimum Stake             | 1000 Dusk        |
| Epoch Duration            | 2160 Blocks      |
| Committee Credits         | 64               |
| Maximum Iterations        | 255              |
| Rolling Finality Blocks   | 5                |
| Maximum Step Timeout      | 60               |

[^1]: a provisioner is *eligible* if it has a stake of at least 1000 DUSK and at least two *epochs* have ended since the stake was created. A new epoch is started every 2160 blocks, counting from the genisis block.

[^2]: this information is considered a security risk, as knowing the identities of the provisioners participating in future rounds (most notably the block generator) could foster collusion or even enable target DoS attacks.