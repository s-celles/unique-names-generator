/**
 * Lazily load the datapackage library (CJS module).
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function getDatapackage(): Promise<any> {
  const mod = await import("datapackage");
  return mod.default ?? mod;
}

/**
 * Load a dictionary from a Frictionless Data Package descriptor.
 *
 * Uses the `datapackage` library to resolve `datapackage.json` descriptors.
 * Supports both local file paths (server-side) and remote HTTPS URLs (browser).
 *
 * @param pathOrUrl - Path or URL to a `datapackage.json` descriptor.
 * @param resourceName - Name of the resource to extract (e.g. `"adjectives"`).
 * @returns A promise resolving to an array of words from the `word` column.
 *
 * @example
 * ```ts
 * // Load from remote URL
 * const adjectives = await loadDictionary(
 *   "https://raw.githubusercontent.com/s-celles/unique-names-data/main/datapackage.json",
 *   "adjectives",
 * );
 *
 * // Load from local path
 * const animals = await loadDictionary("./datapackage.json", "animals");
 * ```
 */
export async function loadDictionary(
  pathOrUrl: string,
  resourceName: string,
): Promise<string[]> {
  const { Package } = await getDatapackage();
  const pkg = await Package.load(pathOrUrl);
  const resource = pkg.getResource(resourceName);

  if (!resource) {
    throw new Error(
      `Resource "${resourceName}" not found in data package at ${pathOrUrl}`,
    );
  }

  const rows: Record<string, unknown>[] = await resource.read({ keyed: true });

  return rows
    .map((row) => String(row["word"] ?? "").trim())
    .filter((w) => w.length > 0);
}
