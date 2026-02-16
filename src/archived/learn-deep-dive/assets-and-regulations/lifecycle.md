---
title: Security Lifecycle
description: Learn about the lifecycle of securities and how Dusk provides institutional grade technology for institutions operating in regulated financial markets.


---

This page starts with a general introduction to the classes of securities and the resulting types of security tokens. We then dive into the mechanics and requirements of these tokens.

## Securities
Securities are tradable financial assets issued to raise funds from investors. These can be equity or debt instruments. Equity refers to the stock, indicating the ownership interest in the company. On the contrary, debt is the sum of money borrowed by the company. Shares (synonymous with stocks) are an example of equity-type securities, whereas a loan, obligation, or bond is debt-type security.

## Dividend and Interest
Dividends are income payments made by companies to shareholders and interest is paid by companies or governments to their bondholders. Typically you see dividends on equity instruments and interest on debt instruments.

Mechanically, they act similarly too. Shareholders who own shares on the dividend date will be owed dividend payments. They are due their dividend, even if a minute or day later, they sell the share to someone else. The same goes for coupon and interest payments on a bond; the owner, at a specific point in time, is the one who receives the payment. This means that:
- The issuer should make dividends available precisely on the dividend date; OR
- An issuer can make dividends available at a later time, so long as the investors who owned the token at the dividend date are the recipient.

## Transfer
Any user who transfers a security token should be able to do so when all requirements are satisfied. If a transaction fails, for whatever reason, it is ideal if the user is notified of the reason for failure. To improve UX these should be in line with existing standards for status codes.

In addition, the possibility to query if a transfer would succeed or not, would significantly improve UX.

## Recovery Mechanism
Any investor who loses access to their security token (e.g. loss of private key) remains a company shareholder (or bondholder). This means that the investor will need to be able to regain access to their security tokens. To enable this, a Security Token Standard needs to provide one of a few possible recovery mechanisms:


At Dusk, we opted for the *‘forced transfer’* recovery method, providing authorised operators with additional controls over the tokens, - even when they are in investor wallets -, meaning that authorised operators are allowed to transfer any of their tokens unilaterally between addresses. So long as the transfer is in compliance with the on-chain transfer restrictions set by the security contract.

The forced transfer mechanic was chosen because, in addition to its use in resolving issues when an investor loses access to its wallets (losing private keys), the forced transfer functionality can also be used to reverse fraudulent transactions and be used to respond to court orders.

**Alternatives considered:** Aktionariat.com pioneered a ‘collateral recovery method’ in which a user can declare that the tokens on the specified address are hers and that she wants to retrieve them through a claim mechanism. She is then required to post collateral for a certain duration. During the claim duration, both the address that she claims is hers (private keys lost), as well as the new address that she is making the claim from, can take hold of the collateral. This mechanism is a more decentralised alternative to the forced transfer option and provides a game theoretical deterrent against malicious users.

The forced transfer mechanic is favored over this alternative because it provides a faster resolution time, and it provides additional utility and safeguards for other circumstances (court orders, reverse fraudulent transactions). In addition it is worth pointing out that less technical users are (assumption) more prone to losing access to their private keys, meaning that a complex decentralized recovery method involving collateral is anything but user friendly. On the contrary, the forced transfer mechanic is seen as essentially a ‘backdoor’ functionality, but that shouldn’t be an issue given the already permissioned nature of a security token contract (you need to request permission to join in the first place).

## Voting
Security tokens make shareholder resolutions easier than they currently are. Under the current system, the two most common ways to pass resolutions are to assemble a shareholder’s meeting physically (which is costly and time-consuming) or to have written resolutions, many of which allow 28 days for a response to be made by a shareholder. These two types discourage companies from putting anything other than hugely significant decisions to a resolution or vote. However, security tokens with voting rights included in the code could allow instantaneous voting, lowering the barrier to shareholder interaction. 

In most jurisdictions, companies can specify how voting works in their shareholder agreements. Hence, whatever voting mechanic we choose for our Security Token Standard can be adopted by companies that use our standard to tokenise. 

In practice, the most straightforward mechanic is:
- **Set Voting:** Governance determines the block height indicating the start and end of the voting period.
- **Vote:** A shareholder submits a vote and its weight, which is proportional to the amount of assets the holder owns. 
- **Poll Count:** Governance decrypts the poll accumulator with its decryption key.

There should be no duplicate votes possible (example: vote, sell tokens to other investor, who then also votes), and some companies might require that votes are only valid if the shareholder is still a shareholder by the end of the voting period.

## Access Management: Allowlist or Identity System

The security token contract is a permissioned system, with roles and access management. Any prospective investor needs to both pass customer due diligence (CDD) and investor eligibility requirements. The CDD requirements pertain to Know-Your-Customer (KYC) and Anti-Money Laundering (AML) checks, whilst the investor eligibility checks pertain to investor type (e.g. retail, professional, accredited investor), and country / residence fit. 

**For example;** an American citizen might not purchase a security token from a company in the Netherlands, even if he passes the KYC/AML checks, unless he is an accredited investor. 

So in terms of access management there are two ways of managing this on-chain:
- An **allowlist** maintained by governance of the security token contract
- A **decentralized identity system** maintained by Trusted Identity Providers

## Allowlist
The allowlist is one of the envisioned solutions that could be managed by the governance of the security token contract. Prospective investors reach out to a governance’ member and go through the CDD and investor eligibility checks. Then once the prospective investor has been vetted their wallets will be added to the allowlist, meaning they are now eligible to purchase, hold, and trade the security token.

The further scale this system, the governance of the security token contract might engage a trusted identity provider to perform this service for them. 

## Identity System
An identity system such as [Citadel](/developer/digital-identity/protocol) could be used to take access management to the next level. Here, the security token contract governance specifies the trusted identity providers, and the `claim_topics` that the prospective investor needs to prove in order to purchase, hold and trade its security token. 

These requirements should be publicly accessible. The `claim_topics` could be:
- Investor type (retail, professional, accredited)
- Country / residence
- KYC/AML 
- Other

Here, it would be important that the governance of the security token has a contractual arrangement with the trusted identity provider, such that if additional information about the investor is requested they can obtain this information. For this reason, it is also important that the governance only allows investors to engage with their token if they have credentials issued by the Trusted Identity Providers specific to the contract.

## Roles

We’ve already touched on the topic of Governance. The governance are the authorized controllers of the security token contract, they have special permissions. In this chapter we will dive a bit more into what these permissions may pertain to, and why these roles are important.

We differentiate between ‘view-access’ and ‘edit-access’.

Updates the contract governance should be broadcasted publicly.

### Shareholder Registry (View Only)
In Dusk, transactions made by investors are covered in a veil of privacy. However, some members of the governance of the security contract will have special permissions to inspect / view the shareholder registry. 

These members can decrypt all of the transactions made by investors, and construe the shareholder registry from this data.

An auditor, or regulator might want to obtain this data in a specified format. In most cases it can be assumed that the data can be downloaded by the governance member, put into the correct format and submitted. But in a later phase, Dusk could reduce the administrative overhead for governance members by enabling downloads straight into the file format requested by regulators.

### Access Management: Allowlist / Identity System (Edit Only) 
Within the security token use case, any investor needs to receive access to purchase, hold and trade the token. This system (allowlist, or identity system) can be managed by the same person as the one who can inspect the shareholder registry, or by an external party. The Identity Manager needs to be able to add, and remove users from the allowlist, or in the case of the identity system, to update the list of Trusted Identity Providers, and update the Claim_Topics.

Whether the total member-size of the allowlist, and updates to the allowlist should be broadcasted publicly is up for debate. It could serve as useful information for prospective investors, whilst it is known that private companies often prefer not to divulge too much information pertaining to their shareholders. In the case of an identity system, updates to the Trusted Identity Provider and Claim_Topics should be broadcasted publicly.

### Recovery Mechanism (Edit Only) 

In some cases, a governance member will be asked to help an investor who has lost his private key. The company itself could be this governance member, or a transfer agent / broker, or other financial institution could be assigned this role. In this case, the governance member needs to both update the whitelist (or request this from the Identity Manager) and then subsequently force transfer tokens from one address to another. 

A forced transfer operation should be broadcasted publicly on the blockchain.

### Pause and Unpause

With the pause and unpause functionality, the governance stops or resumes contract operations. This functionality is pragmatic, as it can be used in emergency situations, or to pause trading ahead of a significant announcement that may impact stock prices. At the same time, in some jurisdictions (Switzerland most notably), this functionality is debated and argued that it has no place in a security token ledger, as the pausing of the contract strips investor rights. 

Pausing and unpausing operations should be publicly broadcasted on the blockchain.

### User & Data Management
So why don’t we just have one administrator role within the security token contract that can do and see everything? The reason is that we should open the opportunity for external parties to contribute to the security token management (governance) without putting the wider security, and compliance, of the system at risk. In addition, data and information are the digital gold of the financial industry. We should limit access to data as much as possible to the intended recipients.

## Mint & Burn
The governance of the security contract should be able to mint new security tokens whenever they like. They might want to mint more tokens to sell these in subsequent funding rounds. In addition, a company might want to do a stock buyback, where they buy back security tokens and remove them from the supply. In addition, a company might use the mint or burn functions to enact a stock split.

Mint and Burn transactions are broadcasted publicly on the blockchain.
