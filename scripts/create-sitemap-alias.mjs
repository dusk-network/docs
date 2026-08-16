import { copyFile } from "node:fs/promises";

const generatedIndex = new URL("../dist/sitemap-index.xml", import.meta.url);
const conventionalAlias = new URL("../dist/sitemap.xml", import.meta.url);

await copyFile(generatedIndex, conventionalAlias);
