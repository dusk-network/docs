const siteSidebar = [
  {
    label: "Learn",
    collapsed: false,
    items: [
      {
        label: "About Dusk",
        collapsed: false,
        items: [
          { label: "Overview", link: "/learn/overview" },
          { label: "Core Components", link: "/learn/core-components" },
          { label: "Core Values", link: "/learn/core-values" },
          { label: "Native Issuance", link: "/learn/tokenization-comparison" },
          { label: "Ecosystem & Partners", link: "/learn/ecosystem" },
          { label: "Tokenomics", link: "/learn/tokenomics" },
          { label: "Get involved & Community", link: "/learn/community" },
          { label: "Glossary", link: "/learn/glossary" },
        ],
      },
      {
        label: "Tools",
        items: [
          { label: "Block Explorer", link: "/learn/block-explorer" },
          { label: "Web Wallet", link: "/learn/web-wallet" },
          { label: "Rusk Wallet", link: "/learn/rusk-wallet" },
        ],
      },
      {
        label: "Guides",
        items: [
          { label: "How to Stake", link: "/learn/guides/staking-basics" },
          { label: "DuskEVM Bridge", link: "/learn/guides/duskevm-bridge" },
          { label: "Mainnet DUSK Migration", link: "/learn/guides/mainnet-migration" },
          { label: "BEP20 Bridge", link: "/learn/guides/bep20-bridge" },
          { label: "Verify Team Account", link: "/learn/verify-team-account" },
        ],
      },
      {
        label: "Deep dive into Dusk",
        collapsed: true,
        items: [
          { label: "Cryptography", link: "/learn/cryptography" },
          { label: "Transaction Models", link: "/learn/deep-dive/duskds-tx-models" },
          { label: "Assets & Regulations", link: "/learn/deep-dive/assets-and-regulations" },
          { label: "DuskVM", link: "/learn/deep-dive/dusk-vm" },
          { label: "DuskEVM", link: "/learn/deep-dive/dusk-evm" },
          { label: "Additional Resources", link: "/learn/deep-dive/additional-resources" },
        ],
      },
    ],
  },
  {
    label: "Developer",
    collapsed: true,
    items: [
      { label: "Overview", link: "/developer/overview" },
      {
        label: "Build on Dusk",
        items: [
          { label: "Deploy on DuskEVM", link: "/developer/smart-contracts-dusk-evm/deploy-on-evm" },
          { label: "Smart Contracts on DuskDS", link: "/developer/smart-contracts-duskds" },
          { label: "Stake Abstraction", link: "/learn/hyperstaking" },
          { label: "Digital Identity Protocol", link: "/developer/digital-identity/protocol" },
        ],
      },
      {
        label: "Integrate with DuskDS",
        items: [
          { label: "Transaction Lifecycle", link: "/developer/integrations/tx-lifecycle" },
          { label: "W3sper SDK", link: "/developer/integrations/w3sper" },
          { label: "HTTP API", link: "/developer/integrations/http-api" },
          { label: "Integrate with Exchanges", link: "/developer/integrations/exchanges" },
          { label: "Encoding & Hashing", link: "/developer/integrations/reference" },
        ],
      },
      {
        label: "Contribute to Dusk",
        items: [
          { label: "Dusk Improvement Proposals", link: "/developer/contribute/dips" },
          { label: "Grants Program", link: "/developer/contribute/grants" },
        ],
      },
    ],
  },
  {
    label: "Node Operator",
    collapsed: true,
    items: [
      { label: "Overview", link: "/operator/overview" },
      {
        label: "Node types",
        items: [
          { label: "Provisioner node", link: "/operator/provisioner" },
          { label: "Archive node", link: "/operator/archive-node" },
          { label: "Prover node", link: "/operator/prover" },
        ],
      },
      {
        label: "Guides",
        items: [
          { label: "Setup wallet on Node", link: "/operator/guides/node-wallet-setup" },
          { label: "Fast-Sync a Node", link: "/operator/guides/fast-sync" },
          { label: "Manually Re-Sync a Node", link: "/operator/guides/manual-resync" },
          { label: "Upgrade a Node", link: "/operator/guides/upgrade-node" },
          { label: "Choose a Network", link: "/operator/networks" },
          { label: "Maintenance & Monitoring", link: "/operator/maintenance-monitoring" },
          { label: "FAQ", link: "/operator/faq" },
          { label: "Troubleshooting", link: "/operator/troubleshooting" },
        ],
      },
    ],
  },
];

export default siteSidebar;
