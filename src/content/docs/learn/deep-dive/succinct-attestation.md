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

The *Deterministic Sortition* procedure allows to select the participating provisioners in each consensus step: the *block generator* in the Proposal step, and the *voting committees* in the Validation and Ratification steps. 

The procedure assigns a number of *credits* (1 in Proposal, and 64 in Validation and Ratificaiton) to eligible provisioner[^1] extracted in a pseudo-random way. The extraction is based on a hash function and a unique cryptographic *seed* that is inserted in the block by the generator and computed by digitally signing the seed in the previous block.

The algorithm follows a weighted distribution such that the probability of being extracted is directly proportional to the stake amount (the bigger the stake, the higher the probability of extraction).
Provisioners can be extracted multiple times in a single sortition (except for the Proposal step), thus being assigned multiple credits. This translates into a bigger weight in the voting committee, where votes count proportionally to the credits of the voter. For instance, a vote from a provisioner with 3 credits, will count as 3 votes in the computation of the quorum.

On average, eligible provisioners will then participate in committees with a frequency and power proportional to their stakes.

### Extraction

The extraction procedure, used to assign each credit in a sortition, is based on the provisioners' stakes and a *score* value computed at each extraction.

Stakes are used to assign a weight to each eligible provisioner. In particular, each provisioner is assigned an initial weight equal to their stake value.

On the other hand, the score value is obtained by hashing a concatenation of round, iteration, and step numbers, the current seed, and the number of the credit to assign.

The extraction works by iterating over provisioners and subtracting each weight from the score until a provisioner with weight higher than the (current) score is found. This provisioner will be extracted and assigned the credit.

To balance out probabilities throughout the sortition, each time a provisioner is extracted, its weight is reduced by 1 DUSK (thus diminishing its probability of extraction).

## Consensus Steps

### Proposal

In this step, a unique provisioner is appointed as the *block generator* for the iteration.
This is done by assigning a single credit with Deterministic Sortition.

The block generator, if online, creates a new *candidate block*, digitally signs it, and broadcasts it to the network.

The other provisioners wait to receive the block from the network for a certain timeout. If the message is received before the timeout expires, the step outputs the candidate block. Otherwise, if the timeout expires, the step outputs an empty value, to indicate no candidate was received.

The step output will be used as the input for the Validation step.

### Validation

In this step, a *committee* of provisioners is appointed to decide whether the candidate block was generated and if it is a valid successor of the current chain tip.
The committee is formed by assigning 64 credits with Deterministic Sortition. Such a committee will then have at most 64 members.

::: Note
The extracted block generator is excluded from the extractions of the Validation and Ratification steps, to avoid voting on its own block.
:::

Each member of the committee votes on the result of the Proposal step: if the candidate block was received, the provisioner verifies its validity as a successor of the current tip, and then votes accordingly: $Valid$, if the verification succeeded, or $Invalid$ otherwise; if no candidate was received, the provisioner casts a $NoCandidate$ vote.

At the same time, all provisioners, including the committee members, collect the votes received from the network until a quorum is reached or the step timeout expires. Vote count is based on the credits of each voter. 

A Validation quorum is reached with either a *supermajority* ($\frac{2}{3}$ of the committee credits) of $Valid$ votes, or a *majority* ($\frac{1}{2}{+}1$) of non-Valid votes ($Invalid$ or $NoCandidate$).

If a quorum is reached, the step outputs the winning vote ($Valid$, $Invalid$, $NoCandidate$) along with the aggregated signatures of all collected votes. 
Otherwise, if the timeout expires, the step outputs $NoQuorum$. 

::: Note
A $NoQuorum$ output represents an unknown result: it is possible that votes reached a quorum but the provisioner did not received them in time. This notion is important to understand [finality](#finality).
:::

The step output will be used as the input for the Ratification step.

### Ratification

In this step, a new *committee* of provisioners, different from the Validation one, is appointed to confirm the result of the Validation step (i.e., whether the Validation committee reached a quorum).
As for Validation, this committee is formed by assigning 64 credits with Deterministic Sortition.

Members of the committee cast a vote with the output of the Validation step. At the same time, all provisioners, including committee members, collect Ratification votes from the network until a quorum is reached or the step timeout expires. 
<!--  -->
In this step, a quorum can either be 

If a quorum is reached for any result, a $\mathsf{Quorum}$ message is generated with an *attestation* of the iteration, which contains the aggregated signatures of both validation and ratification votes.

<!-- Since the attestation proves a candidate reached a quorum, receiving this message is sufficient to accept the candidate into the local chain. -->

The main purpose of the Ratification step is to ensure provisioners are "aligned" with respect to the validation result: if validation result was $Valid$, it ensures a supermajority of provisioners accept the block. Similarly, in case of non-Valid result, it ensures a majority of provisioners will attest this iteration as failed, which, in turn, is used in determining the block [*finality*](#finality).



If the provisioner is part of the committee, it casts a vote with the winning validation vote ($Valid$, $Invalid$, $NoCandidate$, $NoQuorum$). 
The vote is signed and broadcast using a $\mathsf{Ratification}$ message, which also include the validation votes that determined the result.

Then, all nodes, including the committee members, collect votes from the network until a *supermajority*  ($\frac{2}{3}$ of the committee credits) of $Valid$ votes is reached, a *majority* ($\frac{1}{2}{+}1$) of $\text{non-}Valid$ votes is reached, or the step timeout expires. 

If any quorum is reached, the step outputs the winning vote ($Valid$, $Invalid$, $NoCandidate$). Otherwise, if the step timeout expires, the step outputs $NoQuorum$.
In all cases, except $NoQuorum$, the output of the step includes the aggregated votes that determined the result.

The output, together with the validation output, will be used to determine the outcome of the iteration.

<!-- TODO: move to ratification? -->
Note that a quorum non-Valid votes are used to prove an iteration failed (i.e., it can't reach a quorum of $Valid$ votes), which is functional to [block finality](#finality).


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

|          Name           |    Value    |
| :---------------------: | :---------: |
|      Minimum Stake      |  1000 Dusk  |
|     Epoch Duration      | 2160 Blocks |
|    Committee Credits    |     64      |
|   Maximum Iterations    |     255     |
| Rolling Finality Blocks |      5      |
|  Maximum Step Timeout   |     60      |

[^1]: a provisioner is *eligible* if it has a stake of at least 1000 DUSK and at least two *epochs* have ended since the stake was created. A new epoch is started every 2160 blocks, counting from the genisis block.