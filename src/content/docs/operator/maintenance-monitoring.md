---
title: Maintenance & Monitoring
description: Maintenance & Monitoring information for Dusk node runners.
---

# Tips

Here below you can find some recommendations on how to run your node. Especially when running a Provisioner, it is important to make sure that the node is managed in a secure way, as well as having risk-mitigation strategies.

It is recommended to use a dedicated server with only necessary services, as this minimizes the attack surface.


:::tip[Recommended Setup]
The recommended setup for network participants looking to stake and use the network is to run a Provisioner node on a VPS or server, and a Prover locally on their machine/laptop. This ensures the most efficient configuration where the full resources of your provisioner node is at disposal to the consensus, while maximizing privacy by proving privacy-preserving transactions locally.
:::

## Monitoring

Effective monitoring and alerting systems are crucial to avoid slashing events. There are several tools available for real-time monitoring and alerting, which are particularly important for provisioners participating in consensus. Implementing these systems helps ensure continuous performance and timely responses to potential issues.

At minimum, monitor whether the Rusk service is running, whether `ruskquery block-height` is progressing, and whether your node is close to the network tip. If your provisioner was slashed or is at risk of being slashed, follow [Slashing prevention and recovery](/operator/guides/slashing-recovery).

## Keys Management

Proper management of your cryptographic keys is essential to ensure the security of your node.

For this reason, *consensus keys* can be strictly limited to signing consensus messages, such as block proposal, validation, and voting.

Any other critical operations, such as un-staking, withdrawing funds or sending out Dusk can be separated into multiple different keys.

## Sentry Nodes
Denial-of-service (DoS) attacks occur when an attacker floods a server with excessive traffic, preventing it from maintaining its internet connection. Attackers who scan the network may attempt to identify the IP addresses of provisioner nodes and disrupt their operations by overwhelming them with traffic.

A recommended approach to mitigate this risk is to use a sentry node architecture. In this setup, validator nodes connect only to trusted full nodes. Validators may use private data centers with direct connections to major cloud providers, which, in turn, connect to sentry nodes. These sentry nodes act as an intermediary, absorbing the burden of any potential DoS attacks, allowing provisioners to remain secure.

It’s recommended for Provisioners to implement load balancing and distribute incoming traffic across multiple sentry nodes, further reducing the risk of a single node being overwhelmed and enhancing the defense against DoS attacks.

## Firewalls
A well-configured firewall is another critical layer of defense. Firewalls use predefined rules to filter incoming and outgoing traffic, blocking any suspicious or unauthorized requests. For instance, a virtual private server (VPS) firewall should block all ports that are not essential to your services, only allowing legitimate traffic. You can configure your firewall to permit traffic only from trusted sentry nodes, preventing unauthorized access and reducing the risk of attacks. Make sure to check what is the required firewalls configuration.

## SSH keys
When setting up a provisioner on a cloud instance, it's recommended to use SSH keys instead of passwords for secure access. SSH keys are more secure, with key lengths up to 4096 bits, and offer greater protection against server-side compromises. Even if a server is breached, the SSH key remains safe, as it is never exposed during the authentication process. To further secure your SSH key, protect it with a strong passphrase, and make sure to back it up securely in case the device storing it is compromised.
