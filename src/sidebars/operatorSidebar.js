import { createGroup, createLink } from "../helpers/sidebarEntryHelpers";

export default function sidebar(currentPath) {
    return [
        createLink("Overview", "/operator/overview"),

        createGroup("Run a node", currentPath, [
            { label: "Provisioner node", href: "/operator/provisioner" },
            { label: "Archive Node", href: "/operator/archive-node" },
            { label: "Provers", href: "/operator/prover" },
            { label: "Choose a Network", href: "/operator/networks" },
            { label: "Maintenance & Monitoring", href: "/operator/maintenance-monitoring" },
            { label: "Manually Install Rusk", href: "/operator/installation/" },
            { label: "Install Rusk from source", href: "/operator/from-source/" },
            { label: "FAQ", href: "/operator/faq" },
            { label: "Troubleshooting", href: "/operator/troubleshooting" },
            //{ label: "Upgrades history", href: "/operator/introduction/history" },
        ], false),

        createGroup("Guides", currentPath, [
            { label: "Run a Provisioner Node", href: "/operator/guides/provisioner-node" },
            { label: "Run an Archive Node", href: "/operator/guides/archive-node" },
            { label: "Setup wallet on Node", href: "/operator/guides/node-wallet-setup" },
            { label: "Fast-Sync a Node", href: "/operator/guides/fast-sync" },
            { label: "Manually Re-Sync a Node", href: "/operator/guides/manual-resync" },
            { label: "Upgrade a Node", href: "/operator/guides/upgrade-node" },
            { label: "Nocturne faucet", href: "/operator/guides/nocturne-faucet" },
        ], false),
    ];
}
