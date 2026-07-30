const fs = require("node:fs/promises");

const DAY_MS = 24 * 60 * 60 * 1000;
const REGISTRY_ORIGIN = "https://registry.npmjs.org";
const DEFAULT_CONCURRENCY = 16;

const parseArguments = (args) => {
  const options = {
    concurrency: DEFAULT_CONCURRENCY,
    days: undefined,
    exceptions: ".npm-release-age-exceptions.json",
    lockfile: "package-lock.json",
  };

  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index];
    const value = args[index + 1];

    if (argument === "--days") {
      options.days = Number(value);
    } else if (argument === "--exceptions") {
      options.exceptions = value;
    } else if (argument === "--lockfile") {
      options.lockfile = value;
    } else if (argument === "--concurrency") {
      options.concurrency = Number(value);
    } else {
      throw new Error(`Unknown argument: ${argument}`);
    }

    if (value === undefined) {
      throw new Error(`Missing value for ${argument}`);
    }

    index += 1;
  }

  if (!Number.isFinite(options.days) || options.days <= 0) {
    throw new Error("--days must be a positive number");
  }

  if (!Number.isInteger(options.concurrency) || options.concurrency <= 0) {
    throw new Error("--concurrency must be a positive integer");
  }

  return options;
};

const packageNameFromPath = (packagePath) => {
  const marker = "node_modules/";
  const markerIndex = packagePath.lastIndexOf(marker);

  if (markerIndex === -1) {
    throw new Error(
      `Cannot derive a package name from lockfile path: ${packagePath}`,
    );
  }

  const pathParts = packagePath.slice(markerIndex + marker.length).split("/");
  return pathParts[0].startsWith("@")
    ? pathParts.slice(0, 2).join("/")
    : pathParts[0];
};

const packageNameFromResolvedUrl = (resolved, packagePath) => {
  let url;

  try {
    url = new URL(resolved);
  } catch {
    throw new Error(
      `Unsupported resolved source for ${packagePath}: ${resolved}`,
    );
  }

  if (url.origin !== REGISTRY_ORIGIN) {
    throw new Error(`Non-registry dependency in ${packagePath}: ${resolved}`);
  }

  const packagePathname = url.pathname.split("/-/")[0].replace(/^\//, "");
  return decodeURIComponent(packagePathname);
};

const collectRegistryPackages = (lockfile) => {
  if (!lockfile.packages || typeof lockfile.packages !== "object") {
    throw new Error("Lockfile does not contain a packages map");
  }

  const packages = new Map();
  let entryCount = 0;

  for (const [packagePath, entry] of Object.entries(lockfile.packages)) {
    if (packagePath === "" || entry.link) {
      continue;
    }

    if (!entry.version || typeof entry.version !== "string") {
      throw new Error(`Lockfile entry has no exact version: ${packagePath}`);
    }

    const name = entry.resolved
      ? packageNameFromResolvedUrl(entry.resolved, packagePath)
      : packageNameFromPath(packagePath);

    if (!packages.has(name)) {
      packages.set(name, new Set());
    }

    packages.get(name).add(entry.version);
    entryCount += 1;
  }

  return { entryCount, packages };
};

const exceptionKey = (name, version) => JSON.stringify([name, version]);

const readExceptions = async (file, now) => {
  const document = JSON.parse(await fs.readFile(file, "utf8"));

  if (!Array.isArray(document.exceptions)) {
    throw new Error(`${file} must contain an exceptions array`);
  }

  const exceptions = new Map();

  for (const exception of document.exceptions) {
    const { package: name, version, reason, expires } = exception;
    const expiresAt = Date.parse(expires);

    if (
      typeof name !== "string" ||
      typeof version !== "string" ||
      typeof reason !== "string" ||
      reason.trim() === "" ||
      !Number.isFinite(expiresAt)
    ) {
      throw new Error(
        `Invalid release-age exception; expected package, version, reason, and expires: ${JSON.stringify(exception)}`,
      );
    }

    if (expiresAt <= now) {
      throw new Error(`Expired release-age exception: ${name}@${version}`);
    }

    const key = exceptionKey(name, version);

    if (exceptions.has(key)) {
      throw new Error(`Duplicate release-age exception: ${name}@${version}`);
    }

    exceptions.set(key, exception);
  }

  return exceptions;
};

const wait = (milliseconds) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

const fetchPackageMetadata = async (name) => {
  const url = `${REGISTRY_ORIGIN}/${encodeURIComponent(name)}`;
  let lastError;

  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const response = await fetch(url, {
        headers: {
          accept: "application/json",
          "user-agent": "dusk-lockfile-release-age-check/1",
        },
        signal: AbortSignal.timeout(30_000),
      });

      if (response.ok) {
        return await response.json();
      }

      const error = new Error(
        `Registry returned HTTP ${response.status} for ${name}`,
      );

      if (response.status !== 429 && response.status < 500) {
        throw error;
      }

      lastError = error;
    } catch (error) {
      lastError = error;
    }

    await wait(250 * 2 ** attempt);
  }

  throw lastError;
};

const verifyReleaseAges = async ({
  concurrency,
  cutoff,
  exceptions,
  packages,
  now,
}) => {
  const queue = [...packages.entries()];
  const failures = [];
  const usedExceptions = new Set();
  let queueIndex = 0;

  const worker = async () => {
    while (queueIndex < queue.length) {
      const [name, versions] = queue[queueIndex];
      queueIndex += 1;

      let metadata;

      try {
        metadata = await fetchPackageMetadata(name);
      } catch (error) {
        failures.push(`${name}: ${error.message}`);
        continue;
      }

      for (const version of versions) {
        const published = metadata.time?.[version];
        const publishedAt = Date.parse(published);

        if (!published || !Number.isFinite(publishedAt)) {
          failures.push(
            `${name}@${version}: registry publication timestamp is unavailable`,
          );
          continue;
        }

        if (publishedAt >= cutoff) {
          const key = exceptionKey(name, version);

          if (exceptions.has(key)) {
            usedExceptions.add(key);
            continue;
          }

          const age = ((now - publishedAt) / DAY_MS).toFixed(2);
          failures.push(
            `${name}@${version}: published ${published} (${age} days old)`,
          );
        }
      }
    }
  };

  await Promise.all(
    Array.from({ length: Math.min(concurrency, queue.length) }, () => worker()),
  );

  for (const [key, exception] of exceptions) {
    if (!usedExceptions.has(key)) {
      failures.push(
        `${exception.package}@${exception.version}: exception is unused and must be removed`,
      );
    }
  }

  return failures;
};

const main = async () => {
  const options = parseArguments(process.argv.slice(2));
  const now = Date.now();
  const cutoff = now - options.days * DAY_MS;
  const lockfile = JSON.parse(await fs.readFile(options.lockfile, "utf8"));
  const exceptions = await readExceptions(options.exceptions, now);
  const { entryCount, packages } = collectRegistryPackages(lockfile);
  const failures = await verifyReleaseAges({
    concurrency: options.concurrency,
    cutoff,
    exceptions,
    packages,
    now,
  });

  if (failures.length > 0) {
    throw new Error(
      `Package release-age verification failed (minimum ${options.days} days):\n- ${failures
        .sort()
        .join("\n- ")}`,
    );
  }

  console.log(
    `Verified ${entryCount} lockfile entries across ${packages.size} registry packages are at least ${options.days} days old.`,
  );
};

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
