const siteSidebar = [
  {
    label: "Learn",
    collapsed: false,
    items: [
      { label: "Overview", link: "/learn/overview" },
      {
        label: "Purpose and Products",
        collapsed: false,
        items: [
          { label: "Market Infrastructure", link: "/learn/market-infrastructure" },
          { label: "Dusk Trade", link: "/learn/dusk-trade" },
          { label: "Native Issuance", link: "/learn/tokenization-comparison" },
          { label: "Assets and Regulations", link: "/learn/deep-dive/assets-and-regulations" },
          { label: "Core Values", link: "/learn/core-values" },
        ],
      },
      {
        label: "Architecture",
        collapsed: true,
        items: [
          { label: "Core Components", link: "/learn/core-components" },
          { label: "Transaction Models", link: "/learn/deep-dive/duskds-tx-models" },
          { label: "DuskVM", link: "/learn/deep-dive/dusk-vm" },
          { label: "DuskEVM", link: "/learn/dusk-evm" },
          { label: "Cryptography", link: "/learn/cryptography" },
        ],
      },
      {
        label: "Network and Ecosystem",
        collapsed: true,
        items: [
          { label: "Tokenomics", link: "/learn/tokenomics" },
          { label: "Ecosystem", link: "/learn/ecosystem" },
        ],
      },
      {
        label: "Reference",
        collapsed: true,
        items: [
          { label: "Glossary", link: "/learn/glossary" },
          { label: "Additional Resources", link: "/learn/deep-dive/additional-resources" },
        ],
      },
    ],
  },
  {
    label: "Use Dusk",
    collapsed: true,
    items: [
      { label: "Overview", link: "/use/overview" },
      {
        label: "Wallets and Explorers",
        collapsed: true,
        items: [
          { label: "Wallets", link: "/use/wallets" },
          { label: "Explorers", link: "/learn/block-explorer" },
        ],
      },
      {
        label: "Manage DUSK",
        collapsed: true,
        items: [
          { label: "Stake DUSK", link: "/learn/guides/staking-basics" },
          { label: "Bridge to DuskEVM", link: "/learn/guides/duskevm-bridge" },
          { label: "Migrate to Dusk Mainnet", link: "/learn/guides/mainnet-migration" },
          { label: "Bridge to BSC", link: "/learn/guides/bep20-bridge" },
        ],
      },
      {
        label: "Trust and Community",
        collapsed: true,
        items: [
          { label: "Verify Team Accounts", link: "/learn/verify-team-account" },
          { label: "Community", link: "/learn/community" },
        ],
      },
    ],
  },
  {
    label: "Build",
    collapsed: true,
    items: [
      { label: "Overview", link: "/developer/overview" },
      {
        label: "Smart Contracts",
        collapsed: true,
        items: [
          { label: "DuskVM Overview", link: "/developer/duskvm/overview" },
          { label: "DuskVM Quickstart", link: "/developer/duskvm/quickstart" },
          { label: "DuskVM Reference", link: "/developer/duskvm/reference" },
          { label: "DuskEVM Quickstart", link: "/developer/duskevm/quickstart" },
          { label: "DuskEVM Reference", link: "/developer/duskevm/reference" },
        ],
      },
      {
        label: "Wallet Integration",
        collapsed: true,
        items: [
          { label: "Dusk Connect", link: "/developer/integrations/dusk-connect" },
          { label: "Dusk Wallet Integration", link: "/developer/integrations/wallet-extension" },
        ],
      },
      {
        label: "Network Integration",
        collapsed: true,
        items: [
          { label: "W3sper SDK", link: "/developer/integrations/w3sper" },
          { label: "Transaction Lifecycle", link: "/developer/integrations/tx-lifecycle" },
          { label: "HTTP API", link: "/developer/integrations/http-api" },
          { label: "Historical Events", link: "/developer/integrations/historical_events" },
          { label: "Encoding and Hashing", link: "/developer/integrations/reference" },
          { label: "Exchange Integration", link: "/developer/integrations/exchanges" },
        ],
      },
      {
        label: "Protocol Capabilities",
        collapsed: true,
        items: [
          { label: "Stake Abstraction", link: "/learn/hyperstaking" },
          { label: "Digital Identity", link: "/developer/digital-identity/protocol" },
        ],
      },
      {
        label: "Contribute",
        collapsed: true,
        items: [
          { label: "Dusk Improvement Proposals", link: "/developer/contribute/dips" },
          { label: "Grants Program", link: "/developer/contribute/grants" },
        ],
      },
    ],
  },
  {
    label: "Operate",
    collapsed: true,
    items: [
      { label: "Overview", link: "/operator/overview" },
      { label: "Choose a Network", link: "/operator/networks" },
      {
        label: "Node Types",
        collapsed: true,
        items: [
          { label: "Provisioner Node", link: "/operator/provisioner" },
          { label: "Archive Node", link: "/operator/archive-node" },
          { label: "Prover Node", link: "/operator/prover" },
        ],
      },
      {
        label: "Set Up and Maintain",
        collapsed: true,
        items: [
          { label: "Set Up the Node Wallet", link: "/operator/guides/node-wallet-setup" },
          { label: "Maintenance and Monitoring", link: "/operator/maintenance-monitoring" },
          { label: "Upgrade a Node", link: "/operator/guides/upgrade-node" },
          { label: "Fast-Sync a Node", link: "/operator/guides/fast-sync" },
          { label: "Manually Re-Sync a Node", link: "/operator/guides/manual-resync" },
          { label: "Roll Back a Node Update", link: "/operator/guides/rollback-node-update" },
        ],
      },
      {
        label: "Recovery and Help",
        collapsed: true,
        items: [
          { label: "Slashing Recovery", link: "/operator/guides/slashing-recovery" },
          { label: "Troubleshooting", link: "/operator/troubleshooting" },
          { label: "FAQ", link: "/operator/faq" },
        ],
      },
    ],
  },
];

export default siteSidebar;
