import { createGroup, createLink } from "../helpers/sidebarEntryHelpers";

export default function sidebar(currentPath) {
    return [
        createLink("Overview", "/operator/overview"),

        createGroup("Run a node", currentPath, [
            { label: "Run a provisioner node", href: "/operator/provisioner" },
            { label: "Run an archive node", href: "/operator/archive-node" },
            { label: "Run a prover node", href: "/operator/prover" },
            { label: "Setup wallet on Node", href: "/operator/guides/node-wallet-setup" },
            { label: "Fast-Sync a Node", href: "/operator/guides/fast-sync" },
            { label: "Manually Re-Sync a Node", href: "/operator/guides/manual-resync" },
            { label: "Upgrade a Node", href: "/operator/guides/upgrade-node" },
            { label: "Choose a Network", href: "/operator/networks" },
            { label: "Maintenance & Monitoring", href: "/operator/maintenance-monitoring" },
            { label: "FAQ", href: "/operator/faq" },
            { label: "Troubleshooting", href: "/operator/troubleshooting" },
            //{ label: "Upgrades history", href: "/operator/introduction/history" },
        ], false),
    ];
}
