import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import remarkMath from 'remark-math';
import rehypeMathjax from 'rehype-mathjax';
import siteSidebar from "./src/sidebars/siteSidebar";
import starlightLinksValidator from "starlight-links-validator";

const googleAnalyticsId = 'G-63RJYNDBL1';

// https://astro.build/config
export default defineConfig({
	site: "https://docs.dusk.network",
	markdown: {
		remarkPlugins: [remarkMath],
		rehypePlugins: [rehypeMathjax],
	},
	redirects: {
		'/itn/fast-sync': '/nocturne/fast-sync',
		'/itn/node-running-guide': '/nocturne/node-running-guide',
		'/itn/testnet-faucet': '/nocturne/testnet-faucet',
		'/itn/upgrade-node': '/nocturne/upgrade-node',
        '/operator/guides/archive-node': '/operator/archive-node',
        '/operator/guides/provisioner-node': '/operator/provisioner',
		'/learn/guides/dusk-mainnet-onramp': '/learn/guides/legacy',
		'/learn/guides/bep2-migration': '/learn/guides/legacy',
		'/learn/guides/erc20-staking': '/learn/guides/legacy',
		'/learn/deep-dive/assets-and-regulations/mica': '/learn/deep-dive/assets-and-regulations',
		'/learn/deep-dive/assets-and-regulations/lifecycle': '/learn/deep-dive/assets-and-regulations',
		'/learn/deep-dive/assets-and-regulations/dematerialization': '/learn/deep-dive/assets-and-regulations',
		'/learn/deep-dive/economic-protocol': '/learn/tokenomics',
		'/learn/wallet-terminology': '/learn/glossary',
		'/developer/integrations/hashing-algorithms': '/developer/integrations/reference',
		'/developer/integrations/addresses': '/developer/integrations/reference',
		'/developer/smart-contract/hyperstaking_tech': '/learn/hyperstaking',
	},
	integrations: [
		starlight({
			title: "DOCS",
			favicon: "/favicon.ico",
			logo: {
				light: "./src/assets/logo-light.svg",
				dark: "./src/assets/logo-dark.svg",
			},
			social: [
				{ icon: "github", label: "GitHub", href: "https://github.com/dusk-network" },
				{ icon: "x.com", label: "X", href: "https://x.com/duskfoundation" },
				{ icon: "discord", label: "Discord", href: "https://discord.com/invite/dusk-official" },
				{
					icon: "linkedin",
					label: "LinkedIn",
					href: "https://www.linkedin.com/company/dusknetwork/",
				},
				{ icon: "telegram", label: "Telegram", href: "https://t.me/DuskNetwork" },
				{ icon: "youtube", label: "YouTube", href: "https://www.youtube.com/c/DuskNetwork" },
				{ icon: "reddit", label: "Reddit", href: "https://www.reddit.com/r/dusknetwork" },
			],
			customCss: ["./src/fonts/font-face.css", "./src/styles/custom.css"],
			pagination: true,
			tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 4 },
			sidebar: siteSidebar,
			plugins: [starlightLinksValidator()],
			head: [
				// Adding google analytics
				{
					tag: 'script',
					attrs: {
						async: true,
						src: `https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`,
					},
				},
				{
					tag: 'script',
					content: `
					window.dataLayer = window.dataLayer || [];
					function gtag(){dataLayer.push(arguments);}
					gtag('js', new Date());

					gtag('config', '${googleAnalyticsId}');
					`,
				},
			],
		}),
	],
});
