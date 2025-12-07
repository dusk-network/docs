const defaultSidebar = [
  { label: "About Dusk", link: "/learn/overview" },
  {
    label: "Learn about Dusk",
    items: [
      { label: "Native Issuance", link: "learn/tokenization-comparison" },
      { label: "Core Values", link: "learn/core-values" },
      { label: "Core Components", link: "learn/core-components" },
      { label: "Cryptography", link: "learn/cryptography" },
      { label: "Tokenomics", link: "learn/tokenomics" },
      { label: "Stake Abstraction", link: "learn/hyperstaking" },
      { label: "Get involved & Community", link: "learn/community" },
      { label: "Glossary", link: "learn/glossary" },
    ],
  },
  {
    label: "Tools",
    items: [
      { label: "Block Explorer", link: "learn/block-explorer" },
      { label: "Web Wallet", link: "learn/web-wallet" },
      { label: "Rusk Wallet", link: "learn/rusk-wallet" },
    ],
  },
  {
    label: "Guides",
    items: [
      { label: "How to Stake", link: "/learn/guides/staking-basics/" },
      { label: "DuskEVM Bridge", link: "/learn/guides/duskevm-bridge/" },
      { label: "Mainnet DUSK Migration", link: "/learn/guides/mainnet-migration/" },
      { label: "BEP20 Bridge", link: "/learn/guides/bep20-bridge/" },
      { label: "Verify Team Account", link: "learn/verify-team-account" },
    ],
  },
  {
    label: "Deep dive into Dusk",
    items: [
      { label: "Introduction", link: "learn/deep-dive/introduction" },
      {
        label: "Transaction Models",
        link: "learn/deep-dive/duskds-tx-models",
      },
      {
        label: "Assets & Regulations",
        items: [
          {
            label: "MiCA",
            link: "learn/deep-dive/assets-and-regulations/mica",
          },
          {
            label: "Security Lifecycle",
            link: "learn/deep-dive/assets-and-regulations/lifecycle",
          },
          {
            label: "Security Dematerialization",
            link: "learn/deep-dive/assets-and-regulations/dematerialization",
          },
        ],
        collapsed: true,
      },
      { label: "Wallet Terminology", link: "learn/wallet-terminology" },
      { label: "Transaction Fees & Gas", link: "learn/deep-dive/tx-fees" },
      { label: "Economic Protocol", link: "learn/deep-dive/economic-protocol" },
      { label: "DuskVM", link: "learn/deep-dive/dusk-vm" },
      { label: "DuskEVM", link: "learn/deep-dive/dusk-evm" },
      {
        label: "Succinct Attestation Consensus",
        link: "learn/deep-dive/succinct-attestation",
      },
      {
        label: "Slashing",
        link: "learn/deep-dive/slashing"
      },
      {
        label: "Additional Resources",
        link: "learn/deep-dive/additional-resources",
      },
    ],
    collapsed: true,
  },
];

export default defaultSidebar;
