import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import test from "node:test";

const dist = new URL("../dist/", import.meta.url);
const readBuilt = (path) => readFile(new URL(path, dist), "utf8");
const oldPage = "learn/verify-team-account/index.html";

const builtTextFiles = async () =>
  (await readdir(dist, { recursive: true }))
    .map((path) => path.replaceAll("\\", "/"))
    .filter((path) => /\.(html|xml|txt)$/.test(path));

test("the old Verify Team Account URL redirects to Stay safe", async () => {
  const redirectPage = await readBuilt(oldPage);

  assert.match(
    redirectPage,
    /<meta http-equiv="refresh" content="0;url=\/learn\/stay-safe\/">/,
  );
  assert.match(redirectPage, /<meta name="robots" content="noindex">/);
  assert.match(
    redirectPage,
    /<link rel="canonical" href="https:\/\/docs\.dusk\.network\/learn\/stay-safe\/">/,
  );
});

test("Stay safe takes the old page's place in the sidebar and sitemap", async () => {
  const page = await readBuilt("learn/stay-safe/index.html");
  const sitemap = await readBuilt("sitemap-0.xml");

  assert.match(page, /<title>Stay safe \| DOCS<\/title>/);
  assert.match(
    page,
    /Trust and Community[\s\S]*?<a href="\/learn\/stay-safe" aria-current="page"[^>]*>\s*<span[^>]*>Stay Safe<\/span>[\s\S]*?<a href="\/learn\/community"/,
  );
  assert.match(sitemap, /<loc>https:\/\/docs\.dusk\.network\/learn\/stay-safe\/<\/loc>/);
});

test("only the redirect still mentions the old Verify Team Account URL", async () => {
  for (const path of await builtTextFiles()) {
    if (path === oldPage) continue;

    assert.doesNotMatch(
      await readBuilt(path),
      /verify-team-account/,
      `${path} still refers to the old page`,
    );
  }
});

test("no built page ships the client-side account checker", async () => {
  for (const path of await builtTextFiles()) {
    assert.doesNotMatch(
      await readBuilt(path),
      /<verify-account\b/,
      `${path} still ships the account checker`,
    );
  }
});
