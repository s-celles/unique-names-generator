/**
 * Formatting style for generated names.
 *
 * - `'lowercase'` — all characters lowercase (e.g. `"swift emerald falcon"`)
 * - `'capital'` — first letter of each word capitalized (e.g. `"Swift Emerald Falcon"`)
 * - `'uppercase'` — all characters uppercase (e.g. `"SWIFT EMERALD FALCON"`)
 */
export type Style = "lowercase" | "capital" | "uppercase";

/**
 * Options for generating a single name.
 */
export interface GenerateOptions {
  /** Word separator. Defaults to `" "`. */
  separator?: string;
  /** Formatting style. Defaults to `"capital"`. */
  style?: Style;
  /** Seed for deterministic PRNG. */
  seed?: number | string;
}

/**
 * Options for generating a batch of names.
 */
export interface BatchOptions extends GenerateOptions {
  /** Whether all generated names must be unique. Defaults to `true`. */
  unique?: boolean;
  /** Set of names to exclude from generation. */
  exclude?: Set<string>;
}
