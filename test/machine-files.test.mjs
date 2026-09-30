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

test("robots.txt explicitly permits search, AI input, and AI training", async () => {
  const sourceRobots = await readPublicFile("robots.txt");
  const builtRobots = await readFile(
    new URL("../dist/robots.txt", import.meta.url),
    "utf8",
  );
  const contentSignal = builtRobots
    .split(/\r?\n/)
    .find((line) => line.toLowerCase().startsWith("content-signal:"));

  assert.equal(builtRobots, sourceRobots);
  assert.ok(contentSignal, "robots.txt must include a Content-Signal directive");

  const preferences = Object.fromEntries(
    contentSignal
      .slice(contentSignal.indexOf(":") + 1)
      .split(",")
      .map((preference) => {
        const [name, value] = preference.trim().split("=");
        return [name, value];
      }),
  );

  assert.deepEqual(preferences, {
    search: "yes",
    "ai-input": "yes",
    "ai-train": "yes",
  });
});

test("the conventional sitemap URL mirrors Astro's generated sitemap index", async () => {
  const generatedIndex = await readFile(
    new URL("../dist/sitemap-index.xml", import.meta.url),
    "utf8",
  );
  const conventionalAlias = await readFile(
    new URL("../dist/sitemap.xml", import.meta.url),
    "utf8",
  );

  assert.match(generatedIndex, /<sitemapindex\b/);
  assert.equal(conventionalAlias, generatedIndex);
});

test("documentation pages declare a complete default social preview image", async () => {
  const config = await readFile(new URL("../astro.config.js", import.meta.url), "utf8");

  assert.match(config, /property: "og:image"/);
  assert.match(config, /name: "twitter:image"/);
  assert.match(config, /dusk-social-preview-og\.png/);
  assert.match(config, /dusk-social-preview-twitter\.png/);
});

test("the static build provides a canonical noindex fallback for the legacy transaction guide", async () => {
  const redirectPage = await readFile(
    new URL("../dist/learn/transactions/index.html", import.meta.url),
    "utf8",
  );

  assert.match(
    redirectPage,
    /<meta http-equiv="refresh" content="0;url=\/learn\/deep-dive\/duskds-tx-models\/">/,
  );
  assert.match(redirectPage, /<meta name="robots" content="noindex">/);
  assert.match(
    redirectPage,
    /<link rel="canonical" href="https:\/\/docs\.dusk\.network\/learn\/deep-dive\/duskds-tx-models\/">/,
  );
});
