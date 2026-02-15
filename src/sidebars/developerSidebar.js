import { createGroup, createLink } from "../helpers/sidebarEntryHelpers";

export default function sidebar(currentPath) {
    return [
        createLink("Overview", "/developer/overview", currentPath),
        createGroup("Build on Dusk", currentPath, [
            {
                type: "link",
                label: "Deploy on DuskEVM",
                href: '/developer/smart-contracts-dusk-evm/deploy-on-evm'
            },
            {
                type: "link",
                label: "Smart Contracts on DuskDS",
                href: "/developer/smart-contracts-duskds",
            },
            {
                type: "link",
                label: "Digital Identity Protocol",
                href: '/developer/digital-identity/protocol'
            }
        ], false),
        createGroup("Integrate with DuskDS", currentPath, [
            { label: "Transaction Lifecycle", href: '/developer/integrations/tx-lifecycle' },
            { label: "W3sper SDK", href: '/developer/integrations/w3sper' },
            { label: "HTTP API", href: '/developer/integrations/http-api' },
            { label: "Integrate with Exchanges", href: '/developer/integrations/exchanges' },
            { label: "Encoding & Hashing", href: '/developer/integrations/reference' },
        ],
            false),
        createGroup("Contribute to Dusk", currentPath, [
            { label: "Dusk Improvement Proposals", href: '/developer/contribute/dips' },
            { label: "Grants Program", href: '/developer/contribute/grants' },
        ],
            false),
    ];
}
