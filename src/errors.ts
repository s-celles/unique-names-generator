/**
 * Thrown when all possible name combinations have been exhausted.
 */
export class NamespaceExhaustedError extends Error {
  public readonly maxCombinations: number;
  public readonly excludedCount: number;

  constructor(maxCombinations: number, excludedCount: number) {
    super(
      `NamespaceExhaustedError: all ${maxCombinations} possible ` +
        `name combinations are exhausted (${excludedCount} excluded).`,
    );
    this.name = "NamespaceExhaustedError";
    this.maxCombinations = maxCombinations;
    this.excludedCount = excludedCount;
  }
}
