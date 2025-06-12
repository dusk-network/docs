const defaultSidebar = [
  { label: "Get Started", link: "/learn/overview" },
  {
    label: "Learn about Dusk",
    items: [
      { label: "Introduction", link: "learn/introduction" },
      { label: "Native Issuance", link: "learn/tokenization-comparison" },
      { label: "Core Values", link: "learn/core-values" },
      { label: "Core Components", link: "learn/core-components" },
      { label: "DuskEVM", link: "learn/dusk-evm" },
      { label: "Tokenomics", link: "learn/tokenomics" },
      { label: "Wallet Terminology", link: "learn/wallet-terminology" },
      { label: "Transaction Models", link: "learn/tx-models" },
      { label: "Transaction Fees & Gas", link: "learn/tx-fees" },
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
      { label: "Mainnet DUSK Migration", link: "/learn/guides/mainnet-migration/" },
      { label: "BEP20 Bridge", link: "/learn/guides/bep20-bridge/" },
      { label: "Restore Block Height", link: "/learn/guides/restore-height/" },
      { label: "Withdraw staked ERC20 DUSK", link: "/learn/guides/erc20-staking/" },
      { label: "Verify Team Account", link: "learn/verify-team-account" },  
      { label: "Mainnet Onramp", link: "/learn/guides/dusk-mainnet-onramp/" },
      { label: "BEP2 Migration", link: "/learn/guides/bep2-migration/" },
    ],
  },
  {
    label: "Deep dive into Dusk",
    items: [
      { label: "Introduction", link: "learn/deep-dive/introduction" },
      {
        label: "Transaction Models",
        items: [
          {
            label: "Transactions",
            link: "learn/deep-dive/transaction_models/transactions",
          },
          {
            label: "Phoenix",
            link: "learn/deep-dive/transaction_models/phoenix",
          },
          {
            label: "Moonlight",
            link: "learn/deep-dive/transaction_models/moonlight",
          },
          {
            label: "Zedger",
            link: "learn/deep-dive/transaction_models/zedger",
          },
        ],
        collapsed: true,
      },
      {
        label: "Cryptography",
        items: [
          {
            label: "Zero Knowledge Proofs",
            link: "learn/deep-dive/cryptography/zkp",
          },
          { label: "Circuits", link: "learn/deep-dive/cryptography/circuits" },
          {
            label: "IOP and PCS",
            link: "learn/deep-dive/cryptography/iop_pcs",
          },
          { label: "PLONK", link: "learn/deep-dive/cryptography/plonk" },
          { label: "KZG", link: "learn/deep-dive/cryptography/kzg" },
          { label: "BLS12-381", link: "learn/deep-dive/cryptography/bls" },
          { label: "Hashing", link: "learn/deep-dive/cryptography/hashing" },
        ],
        collapsed: true,
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
      { label: "Economic Protocol", link: "learn/deep-dive/economic-protocol" },
      { label: "Dusk VM", link: "learn/deep-dive/dusk-vm" },
      {
        label: "Succinct Attestation Consensus",
        link: "learn/deep-dive/succinct-attestation",
      },
      {
        label: "Slashing",
        link: "learn/deep-dive/slashing"
      },

      { label: "Token Standards", 
        link: "learn/token-standards" 
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
