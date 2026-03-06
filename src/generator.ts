import seedrandom from "seedrandom";
import type { BatchOptions, GenerateOptions, Style } from "./types.js";
import { NamespaceExhaustedError } from "./errors.js";

/**
 * Return the total number of possible combinations for the given dictionaries.
 */
export function combinationCount(dictionaries: string[][]): number {
  if (dictionaries.length === 0) return 0;
  return dictionaries.reduce((acc, d) => acc * d.length, 1);
}

/**
 * Apply the formatting style to a generated name.
 */
function applyStyle(name: string, separator: string, style: Style): string {
  switch (style) {
    case "capital":
      return name
        .split(separator)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(separator);
    case "uppercase":
      return name.toUpperCase();
    case "lowercase":
      return name.toLowerCase();
    default:
      return name;
  }
}

/**
 * Create a seeded or unseeded PRNG.
 *
 * When a seed is provided the returned function is deterministic and
 * produces a sequence compatible with the Julia `MersenneTwister` seeded
 * via `seedrandom` (alea algorithm, same library used in both ecosystems).
 */
function createRng(seed?: number | string): () => number {
  if (seed !== undefined) {
    return seedrandom.alea(String(seed));
  }
  return Math.random;
}

/**
 * Pick a random element from an array using the given PRNG.
 */
function pick(rng: () => number, arr: readonly string[]): string {
  return arr[Math.floor(rng() * arr.length)];
}

/**
 * Generate a single random name by picking one word from each dictionary.
 *
 * @param dictionaries - Ordered array of word lists.
 * @param options - Generation options (separator, style, seed).
 * @returns A formatted name string.
 *
 * @example
 * ```ts
 * import { generateName } from "@scelles/unique-names-generator";
 *
 * const name = generateName(
 *   [["swift", "bold"], ["emerald", "crimson"], ["falcon", "otter"]],
 *   { style: "capital", seed: 42 },
 * );
 * ```
 */
export function generateName(
  dictionaries: string[][],
  options: GenerateOptions = {},
): string {
  const { separator = " ", style = "capital", seed } = options;

  for (const d of dictionaries) {
    if (d.length === 0) {
      throw new Error("Cannot generate a name from an empty dictionary.");
    }
  }

  const rng = createRng(seed);
  const words = dictionaries.map((d) => pick(rng, d));
  return applyStyle(words.join(separator), separator, style);
}

/**
 * Generate `n` names. When `unique` is true (default), all names in the
 * returned array are distinct (case-insensitive). Throws
 * {@link NamespaceExhaustedError} when requesting more unique names than
 * available combinations.
 *
 * @param dictionaries - Ordered array of word lists.
 * @param n - Number of names to generate.
 * @param options - Batch generation options.
 * @returns Array of formatted name strings.
 *
 * @example
 * ```ts
 * import { generateNames } from "@scelles/unique-names-generator";
 *
 * const names = generateNames(
 *   [["swift", "bold"], ["falcon", "otter"]],
 *   3,
 *   { seed: 42, unique: true },
 * );
 * ```
 */
export function generateNames(
  dictionaries: string[][],
  n: number,
  options: BatchOptions = {},
): string[] {
  const {
    separator = " ",
    style = "capital",
    seed,
    unique = true,
    exclude,
  } = options;

  const rng = createRng(seed);
  const maxCombos = combinationCount(dictionaries);

  if (unique) {
    const seen = new Set<string>(
      exclude ? [...exclude].map((e) => e.toLowerCase()) : [],
    );

    if (n > maxCombos - seen.size) {
      throw new NamespaceExhaustedError(maxCombos, seen.size);
    }

    const results: string[] = [];
    const maxAttempts = Math.min(maxCombos, 1000) * n;
    let attempts = 0;

    while (results.length < n) {
      if (attempts++ > maxAttempts) {
        // Brute-force fallback — iterate all combinations
        const remaining = bruteForceRemaining(
          dictionaries,
          seen,
          separator,
          style,
          n - results.length,
        );
        results.push(...remaining);
        break;
      }

      const words = dictionaries.map((d) => pick(rng, d));
      const raw = words.join(separator);
      const name = applyStyle(raw, separator, style);

      if (!seen.has(name.toLowerCase())) {
        seen.add(name.toLowerCase());
        results.push(name);
      }
    }

    return results;
  }

  // Non-unique: simply generate n names
  return Array.from({ length: n }, () => {
    const words = dictionaries.map((d) => pick(rng, d));
    return applyStyle(words.join(separator), separator, style);
  });
}

/**
 * Brute-force remaining unique names by iterating all possible combinations.
 */
function bruteForceRemaining(
  dictionaries: string[][],
  seen: Set<string>,
  separator: string,
  style: Style,
  needed: number,
): string[] {
  const results: string[] = [];
  const indices = new Array(dictionaries.length).fill(0);
  const lengths = dictionaries.map((d) => d.length);

  while (results.length < needed) {
    const words = indices.map((idx, i) => dictionaries[i][idx]);
    const raw = words.join(separator);
    const name = applyStyle(raw, separator, style);

    if (!seen.has(name.toLowerCase())) {
      seen.add(name.toLowerCase());
      results.push(name);
      if (results.length >= needed) {
        return results;
      }
    }

    // Increment indices (odometer-style)
    let carry = true;
    for (let i = indices.length - 1; i >= 0 && carry; i--) {
      indices[i]++;
      if (indices[i] >= lengths[i]) {
        indices[i] = 0;
      } else {
        carry = false;
      }
    }

    // If we wrapped all the way around, all combos exhausted
    if (carry) {
      throw new NamespaceExhaustedError(
        combinationCount(dictionaries),
        seen.size,
      );
    }
  }

  return results;
}
