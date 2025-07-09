import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import remarkMath from 'remark-math';
import rehypeMathjax from 'rehype-mathjax';
import defaultSidebar from "./src/sidebars/defaultSidebar";
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
	},
	integrations: [
		starlight({
			title: "DOCUMENTATION",
			favicon: "/favicon.ico",
			logo: {
				light: "./src/assets/logo-light.svg",
				dark: "./src/assets/logo-dark.svg",
			},
			components: {
				Duskconverter: "./src/components/Duskconverter.astro",
				PageFrame: "./src/components/PageFrame.astro",
				Header: "./src/components/Header.astro",
				ContentPanel: "./src/components/ContentPanel.astro",
				Sidebar: './src/overrides/Sidebar.astro',
				SiteTitle: './src/overrides/SiteTitle.astro',
			},
			social: {
				github: "https://github.com/dusk-network",
				"x.com": "https://x.com/duskfoundation",
				discord: "https://discord.com/invite/dusk-official",
				linkedin: "https://www.linkedin.com/company/dusknetwork/",
				telegram: "https://t.me/DuskNetwork",
				youtube: "https://www.youtube.com/c/DuskNetwork",
				reddit: "https://www.reddit.com/r/dusknetwork",
			},
			customCss: ["./src/fonts/font-face.css", "./src/styles/custom.css"],
			pagination: true,
			tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 4 },
			sidebar: defaultSidebar,
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
