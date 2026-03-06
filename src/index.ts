/**
 * @scelles/unique-names-generator
 *
 * A generic, type-safe, and deterministic pseudonym generator.
 *
 * @packageDocumentation
 */

export { generateName, generateNames, combinationCount } from "./generator.js";
export { loadDictionary } from "./loader.js";
export { NamespaceExhaustedError } from "./errors.js";
export type { GenerateOptions, BatchOptions, Style } from "./types.js";
