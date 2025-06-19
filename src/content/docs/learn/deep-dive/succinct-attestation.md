---
title: Succinct Attestation Consensus
description: Understand the innovative consensus mechanism that secures Dusk.
---

The Dusk consensus protocol, called **Succinct Attestation** (**SA**), is a permission-less, committee-based proof-of-stake consensus protocol.

The protocol is run by all stakers, known as ***provisioners***, which are responsible for generating, validating, and ratifying new blocks. 
Provisioners are pseudo-randomly selected to participate in each [consensus step](#succinct-attestation-sa-protocol). The selection is made through the [*Deterministic Sortition*](#deterministic-sortition) algorithm, which extracts provisioners in a non-interactive way based on their stakes: the higher the stake, the more the provisioner gets extracted.

## Deterministic Sortition

The *Deterministic Sortition* procedure allows the selection of the provisioners participating in each consensus step: the *block generator* in the Proposal step, and the *voting committees* in the Validation and Ratification steps. 

The procedure assigns a number of *credits* (1 in Proposal, and 64 in Validation and Ratification) to an eligible provisioner[^1] that is extracted in a pseudo-random way. The extraction is based on a hash function and a unique cryptographic *seed* that the generator inserts into the block by digitally signing the seed from the previous block.

The algorithm follows a weighted distribution such that the probability of being extracted is directly proportional to the stake amount (the more a provisioner stakes, the higher the probability of being extracted).
Provisioners can be extracted multiple times in a single sortition (except for the Proposal step), thus being assigned multiple credits. This translates into a bigger weight in the voting committee, where votes count proportionally to the credits of the voter. For instance, a vote from a provisioner with 3 credits, will count as 3 votes in the computation of the quorum.

On average, eligible provisioners will then participate in committees with a frequency and power proportional to their stakes.

### Extraction

The extraction procedure, used to assign each credit in a sortition, is based on the provisioners' stakes and a *score* value computed at each extraction.

Stakes are used to assign a weight to each eligible provisioner. In particular, each provisioner is assigned an initial weight equal to their stake value.

On the other hand, the score value is obtained by hashing a concatenation of round, iteration, and step numbers, the current seed, and the number of the credit to assign.

The extraction works by iterating over provisioners and subtracting each weight from the score until a provisioner with weight higher than the (current) score is found. This provisioner will be extracted and assigned the credit.

To balance out probabilities throughout the sortition, each time a provisioner is extracted, its weight is reduced by 1 DUSK (thus diminishing its probability of extraction).

## Succinct Attestation (SA) Protocol

The SA protocol is run in ***rounds***, with each round adding a new block to the blockchain. In turn, each round proceeds per ***iterations***, with each iteration aiming at generating a new *candidate* block and reaching agreement on the validity and the acceptance of such a block.

An iteration is composed of three ***steps***:
  1. [***Proposal***](#proposal), where an extracted provisioner is appointed to generate a new block and broadcast it to the network.
  2. [***Validation***](#validation), where a committee of extracted provisioners votes on the validity of the new block.
  3. [***Ratification***](#ratification), where another committee of provisioners votes on the result of the Validation step.

If a candidate is produced in the Proposal step, and a supermajority of favorable votes is reached in both Validation and Ratification, the candidate is added to the blockchain. The result of an iteration is certified with an [***attestation***](#attestation) containing the (digitally-signed) votes of all the committee members that reached consensus on the block.

When an iteration fails to produce and reach consensus on a block, a new one is executed with a new block generator (and hence a new candidate block) and a new set of voters. To mitigate the risk of forks, when a provisioner starts a new iteration, it stops participating in previous ones (except in [Emergency Mode](#emergency-mode)). A maximum of 50 iterations is run in a single round. If no block was produced after 50 iterations, nodes enter an [Open Mode](#open-mode) in which they wait for a block to reach consensus or a Dusk-signed [Emergency Block](#emergency-block) to be received.

### Proposal

In this step, a unique provisioner is selected with [Deterministic Sortition](#deterministic-sortition) and appointed as the *block generator*.

If online, the generator creates a new *candidate block*, digitally signs it, and broadcasts it to the network.

All other provisioners wait to receive the block from the network, for a certain timeout. If the candidate is received before the timeout expires, the step outputs it. Otherwise, the step outputs $NoCandidate$, indicating that no block was received.

The step output is used as the input for the following Validation step.

### Validation

In this step, a *committee* of provisioners, selected by assigning 64 credits with [Deterministic Sortition](#deterministic-sortition), is appointed to decide whether a candidate block was generated for the iteration, and if it is a valid successor of the current chain tip.

::: Note
The candidate generator is excluded from the Validation and Ratification committees to prevent him from voting on his own block.
:::

Each committee member votes on the result of the Proposal step with their own node: if the candidate block is received, they verify its validity and then vote accordingly: $Valid$, if the verification succeeded, or $Invalid$ if it did not succeed; otherwise, they vote $NoCandidate$.

At the same time, all provisioners, including the committee members, collect the votes received from the network until a quorum is reached or the step timeout expires. A Validation quorum is reached with either a *supermajority* ($\frac{2}{3}$ of the committee credits) of $Valid$ votes, or a *majority* ($\frac{1}{2}{+}1$) of $Invalid$ or $NoCandidate$ votes. The vote count is based on the credits of each voter.

If a quorum is reached, the step outputs the corresponding vote ($Valid$, $Invalid$, $NoCandidate$) along with the aggregated BLS signatures of collected votes. If the timeout expires before reaching a quorum, the step outputs $NoQuorum$. 

::: Note
A $NoQuorum$ output represents an unknown result: it is in fact possible that votes actually reached a quorum but the provisioner did not receive all of them in time. This notion is important to understand [finality](#finality).
:::

The step output is used as the input for the following Ratification step.

### Ratification

In this step, a new committee of provisioners is appointed to confirm or ratify the result of the Validation step. This committee is different from the Validation one. Similar to Validation, this committee is formed by assigning 64 credits with [Deterministic Sortition](#deterministic-sortition).

The main purpose of this step is to ensure provisioners are aligned with the outcome of the Validation step: if the result was a $Valid$ quorum, it ensures a large portion of provisioners will indeed accept the block, while in case of $\text{non-}Valid$ quorum, it ensures the iteration will be attested as failed (which is relevant to block [finality](#finality)).

Members of the committee cast a vote corresponding to the Validation output (on their own node): $Valid$, $Invalid$, or $NoCandidate$, if a quorum was reached, and $NoQuorum$ otherwise. 

At the same time, all provisioners, including committee members, collect votes from the network until a quorum is reached or the step timeout expires. In this step, a quorum can either be a *supermajority* ($\frac{2}{3}$ of the committee credits) of $Valid$ votes, or a *majority* ($\frac{1}{2}{+}1$) of $Invalid$, $NoCandidate$, or $NoQuorum$ votes.

The step outputs $Success$ if a quorum of $Valid$ was reached, $Fail$ if a quorum of non-Valid votes was reached, or $NoQuorum$ if the timeout expired. 

::: Note
A result of $Fail(NoQuorum)$ means that a majority of the Ratification committee agreed on not having seen a quorum in the Validation step. This is effectively considered a failed iteration, even if a quorum of Validation votes actually existed.
:::

The output of the Ratification step determines the iteration outcome.

### Attestation

If a quorum is reached in the Ratification step, an ***attestation*** for the iteration is produced. An attestation contains the Ratification output ($Success$, $Fail(Invalid)$, $Fail(NoCandidate)$, or $Fail(NoQuorum)$) and the corresponding vote signatures for Validation and Ratification, in aggregated form (two bitsets are also included to indicate which committee members cast the vote in each step).

If the iteration ends without a consensus (i.e., the Ratification step outputs $NoQuorum$), the outcome is considered unknown by the node and no attestation is created. The reason for this is the intrinsic uncertainty of missing quorum, which is simply not possible to prove (votes can have been cast but not been received).

To speed up synchronization, all attestations are broadcast to the network. If a node is still running an iteration and receives a valid attestation from the network, it immediately interrupts the consensus execution and acts according to the attested result.

We call an attestation of a $Success$ result a ***Success Attestation***. Conversely, we call an attestation of a $Fail$ result a ***Fail Attestation***.

### Outcome

When a Success Attestation is produced, or received, the iteration ends, and the candidate block is accepted as the new tip into the local chain. This also determines the end of the round.

If a Fail Attestation is produced, or received, the iteration ends, and a new one is started. The attestation is also stored in a *failed iterations* registry, which will be included in future candidate blocks of the same round to determine the *finality state* in case of acceptance (see [Finality](#finality)).

## Finality

Given the distributed nature of the protocol, it is possible that multiple iterations (in the same round) reach consensus on a candidate block, producing a blockchain *fork* (i.e., multiple branches stemming from a common block). This is typically due to network congestion, which can cause messages to be delayed or lost. In these cases, different nodes can accept different blocks for the same height creating a split in the network. 

To resolve conflicts, when a node detects multiple blocks for the same round, it always chooses the one from the lowest iteration. This mechanism allows to automatically resolve forks as soon as all conflicting blocks are received by all nodes.

As a consequence of the above, blocks from iterations greater than 0 can potentially be replaced by a lower-iteration block that also reached consensus. On the other hand, blocks from iteration 0 cannot be replaced by lower-iteration ones.

To handle forks, we use the concept of *finality*, where a block is considered *final* when it cannot be reverted anymore, (that is, it becomes an immutable part of the ledger). 

In particular, we use an approach known as ***rolling finality***, where blocks are finalized in a progressive way by the acceptance of new blocks. Each block in the blockchain can be in one of the following ***finality states***:

  - $Accepted$: the block has been accepted but it might be replaced by a lower-iteration candidate with a Success Attestation;

  - $Attested$: the block has been accepted and it cannot be replaced by a lower-iteration candidate. It can however be reverted if a previous block is replaced.
  
  - $Confirmed$: the block is either $Accepted$ or $Attested$ but has a lower probability of being replaced due to the acceptance of enough blocks after it (see [finality rules](#finality-rules)). It can however be reverted if a previous block is replaced.

  - $Final$: the block cannot be replaced nor reverted anymore and is then immutable.

::: Note
Rolling finality depends on the knowledge of other blocks, and is then only applied locally to a node. Nonetheless, given its deterministic design, two nodes having the same blocks in the local chain will also have the same finality states.
:::

### Previous Non-Attested Iterations (PNI)

When accepting a new block into the chain, its initial finality state is decided based on the number of *previous non-attested iterations*, or $PNI$.

Specifically, given a block at iteration $I$, $PNI$ is the number of iterations lower than $I$ for which there is no known Fail Attestation. The reference set of Fail Attestations is the $FailedIterations$ field of the block itself, from which $PNI$ is directly derived. This field contains all the Fail Attestations for previous iterations known to the generator when creating the candidate block.

The rationale of this approach is the following: a Fail Attestation proves that a quorum was reached for a Fail result, implying that no Success Attestation can have been produced for a candidate in the same iteration (in fact, there can only be one possible quorum[^2]). Thus, the accepted block cannot be replaced by a candidate from such iteration. Following the same reasoning, we can say that a block can only be replaced by candidates from (previous) iterations whose result is unknown, that is, for which there is no Fail Attestation.

### Finality Rules

The finality state of each block in the local chain is determined as follows:

 - A new block is marked as $Attested$ if $PNI=0$, and $Accepted$ if $PNI>0$;
 - If a block is $Attested$, it is marked as $Confirmed$ when its successor is marked $Attested$ or $Confirmed$;
 - If a block is $Accepted$, it is marked as $Confirmed$ after accepting $2 \times PNI$ consecutive $Attested$ or $Confirmed$ blocks;
 - If a block is $Confirmed$ and its parent is $Final$, it is marked as $Final$.

For instance, if a block from iteration 5 has 2 previous iterations with a Fail Attestation (that is, $PNI=3$), it is initially marked as $Accepted$ and becomes $Confirmed$ when the following $2 \times 3 = 6$ blocks are either $Attested$ or $Confirmed$. If, when marked as $Confirmed$, its parent block is $Final$, it is also marked as $Final$.

::: Note
A block can only be $Final$ if all previous blocks are $Final$.
:::


## Special Consensus Modes

When the network is failing to produce a block for a given round, the SA protocol progressively enters less strict modes of operation, where certain constraints are not enforced anymore, so as to increase the probability of success and guarantee the liveness of the chain.

### Relaxed Mode

After 8 failed iterations, the consensus enters the *Relaxed Mode*, in which no more Fail Attestations are stored in the $FailedIterations$ field. In other words, $FailedIterations$ will only contain at most 8 attestations.
This mode is enabled to avoid bloating the size of candidate blocks with an excessive number of attestations.

### Emergency Mode

After 16 failed iterations, the consensus enters the *Emergency Mode*, in which iterations are kept active until either they reach a result (i.e., either a *Success* or a *Fail* attestation is produced) or a block at the same round is accepted. In particular, in this mode steps do not have a timeout and they only end if a positive result is achieved (i.e., a candidate is produced in Proposal, and a quorum is reached in Validation and Ratification).

Extracted provisioners are allowed to participate in all emergency-mode iterations at the same time, increasing the risk of forks but maximizing the probability of producing a block.

Note that $NoCandidate$ and $NoQuorum$ results and votes are not allowed in Emergency Mode.

### Open Mode

If a node reaches the end of the last iteration without an accepted block, it enters the *Open Mode*, in which all currently active emergency-mode iterations are kept running, but no new ones are started. 

This mode is designed to cope with massive network congestions or splits: in particular, nodes wait for missing nodes to rejoin the network and reach consensus on one of the iterations.

### Emergency Block

In extreme cases, in which no block is produced for an excessive amount of time, an *Emergency Block* can be broadcast by one of the nodes run by Dusk. This block needs no validation or consensus and is automatically accepted by all nodes. Consensus will then start from the following round following the standard rules. 

Note that the Emergency Block is accepted with finality state $Accepted$ and can thus be replaced by a lower-iteration block until it is finalized by the Rolling Finality (see [*Finality*](#finality)).

## Global Parameters

|           Name           |    Value    |
| :----------------------: | :---------: |
|      Minimum Stake       |  1000 Dusk  |
|      Epoch Duration      | 2160 Blocks |
|    Committee Credits     |     64      |
|    Maximum Iterations    |     50      |
|   Maximum Step Timeout   |     40      |
|  Relaxed Mode Iteration  |      8      |
| Emergency Mode Iteration |     16      |

[^1]: a provisioner is *eligible* if it has a stake of at least 1000 DUSK and at least two *epochs* have ended since the stake was created. A new epoch is started every 2160 blocks, counting from the genesis block.

[^2]: this is true as long as committee members do not cast a double vote. To discourage such a behavior, double votes are penalized with slashing.