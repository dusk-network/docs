import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const readPublicFile = (name) =>
  readFile(new URL(`../public/${name}`, import.meta.url), "utf8");

test("robots.txt permits crawling and advertises the generated sitemap index", async () => {
  const robots = await readPublicFile("robots.txt");

  assert.match(robots, /^User-agent: \*$/m);
  assert.match(robots, /^Allow: \/$/m);
  assert.match(
    robots,
    /^Sitemap: https:\/\/docs\.dusk\.network\/sitemap-index\.xml$/m,
  );
  assert.doesNotMatch(robots, /^Disallow: \/$/m);
});

test("the conventional sitemap URL points agents to Astro's generated child sitemap", async () => {
  const sitemap = await readPublicFile("sitemap.xml");

  assert.match(sitemap, /<sitemapindex\b/);
  assert.match(
    sitemap,
    /<loc>https:\/\/docs\.dusk\.network\/sitemap-0\.xml<\/loc>/,
  );
});

test("documentation pages declare a complete default social preview image", async () => {
  const config = await readFile(new URL("../astro.config.js", import.meta.url), "utf8");

  assert.match(config, /property: "og:image"/);
  assert.match(config, /name: "twitter:image"/);
  assert.match(config, /dusk-social-preview-og\.png/);
  assert.match(config, /dusk-social-preview-twitter\.png/);
});
