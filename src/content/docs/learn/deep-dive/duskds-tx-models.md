---
title: DuskDS Transaction Models
description: How Phoenix (Shielded) and Moonlight (Public) work on the DuskDS settlement layer, and how they relate to higher-level systems.
---

Dusk has a two-layer architecture:

- **DuskDS** – the settlement and data layer (consensus, data availability, transaction models)
- **DuskEVM** – the EVM execution layer where smart contracts run and where Hedger lives

This page describes the transaction models on DuskDS. It’s background for people who want to understand how settlement and privacy work under the hood. If you are building dApps on DuskEVM, you’ll mostly interact with Hedger and EVM contracts instead.

## Phoenix vs Moonlight (on DuskDS)

On DuskDS, value can move in two native ways:

- **Moonlight** – public, account-based transfers  
- **Phoenix** – shielded, note-based transfers using zero-knowledge proofs

Both ultimately settle on the same chain, but they expose different information to observers.

For the complete implementation details you can refer to the [Whitepaper](https://dusk-cms.ams3.digitaloceanspaces.com/Dusk_Whitepaper_2024_4db72f92a1.pdf).

### Moonlight – public balances

Moonlight is the transparent transaction model:

- Accounts have visible balances.
- Transfers show sender, recipient, and amount.
- It’s suited to flows that must be observable (e.g. some treasury or reporting scenarios).

Conceptually it behaves like a standard account model. For most users, this is "just the transparent way to move DUSK" at the protocol layer.

### Phoenix – shielded balances

Phoenix is the privacy-preserving model:

- Funds live as encrypted "notes" rather than explicit balances.
- Transactions prove correctness (no double spends, enough funds) with zero-knowledge proofs without revealing:
  - how much is being moved,
  - who sent the note, except to the receiver,
  - between which specific notes.
- Users can selectively reveal information via viewing keys where regulation or auditing requires it.

For most people, Phoenix is the underlying mechanism that powers shielded balances and private transfers on Dusk.

## The Transfer Contract

At the DuskDS level, a Transfer Contract coordinates value movement:

- It accepts different transaction payloads (Phoenix-style, Moonlight-style).
- It routes them to the appropriate verification logic.
- It ensures the global state stays consistent (no double spends, fees handled, etc.).

You typically don’t interact with this contract directly unless you are working on protocol implementations. It’s the settlement engine behind the wallet and higher-level systems.
