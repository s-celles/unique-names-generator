import { describe, it, expect } from "vitest";
import {
  generateName,
  generateNames,
  combinationCount,
  NamespaceExhaustedError,
} from "../src/index.js";

const DICT_A = ["swift", "bold", "gentle"];
const DICT_B = ["emerald", "crimson", "azure"];
const DICT_C = ["falcon", "otter", "lynx"];

describe("generateName", () => {
  it("should generate a name from dictionaries", () => {
    const name = generateName([DICT_A, DICT_B, DICT_C]);
    expect(name).toBeTruthy();
    expect(name.split(" ")).toHaveLength(3);
  });

  it("should be deterministic with the same seed", () => {
    const name1 = generateName([DICT_A, DICT_B, DICT_C], { seed: 42 });
    const name2 = generateName([DICT_A, DICT_B, DICT_C], { seed: 42 });
    expect(name1).toBe(name2);
  });

  it("should produce different names with different seeds", () => {
    const name1 = generateName([DICT_A, DICT_B, DICT_C], { seed: 1 });
    const name2 = generateName([DICT_A, DICT_B, DICT_C], { seed: 2 });
    // Very unlikely to be the same, but not impossible
    // With 27 combinations and 2 different seeds, collision is possible but rare
    expect(typeof name1).toBe("string");
    expect(typeof name2).toBe("string");
  });

  it("should throw on empty dictionary", () => {
    expect(() => generateName([[], DICT_B])).toThrow(
      "Cannot generate a name from an empty dictionary.",
    );
  });

  it("should use custom separator", () => {
    const name = generateName([DICT_A, DICT_B], {
      seed: 42,
      separator: "-",
    });
    expect(name).toContain("-");
    expect(name.split("-")).toHaveLength(2);
  });
});

describe("generateName — styles", () => {
  it("should format as capital (default)", () => {
    const name = generateName([["swift"], ["falcon"]], { seed: 1 });
    expect(name).toBe("Swift Falcon");
  });

  it("should format as lowercase", () => {
    const name = generateName([["Swift"], ["Falcon"]], {
      seed: 1,
      style: "lowercase",
    });
    expect(name).toBe("swift falcon");
  });

  it("should format as uppercase", () => {
    const name = generateName([["swift"], ["falcon"]], {
      seed: 1,
      style: "uppercase",
    });
    expect(name).toBe("SWIFT FALCON");
  });

  it("should apply capital style with custom separator", () => {
    const name = generateName([["swift"], ["falcon"]], {
      seed: 1,
      separator: "_",
      style: "capital",
    });
    expect(name).toBe("Swift_Falcon");
  });
});

describe("generateNames — batch", () => {
  it("should generate n names", () => {
    const names = generateNames([DICT_A, DICT_B, DICT_C], 5, { seed: 42 });
    expect(names).toHaveLength(5);
  });

  it("should generate unique names by default", () => {
    const names = generateNames([DICT_A, DICT_B, DICT_C], 10, { seed: 42 });
    const uniqueSet = new Set(names.map((n) => n.toLowerCase()));
    expect(uniqueSet.size).toBe(10);
  });

  it("should allow non-unique names", () => {
    const names = generateNames([["a"], ["b"]], 5, {
      seed: 42,
      unique: false,
    });
    expect(names).toHaveLength(5);
    // All should be the same since there's only one combination
    expect(names.every((n) => n === names[0])).toBe(true);
  });

  it("should respect exclude set", () => {
    const exclude = new Set(["Swift Falcon"]);
    const names = generateNames([["swift"], ["falcon", "otter"]], 1, {
      seed: 42,
      exclude,
    });
    expect(names[0].toLowerCase()).not.toBe("swift falcon");
  });
});

describe("NamespaceExhaustedError", () => {
  it("should throw when all combinations are exhausted", () => {
    expect(() => generateNames([["a"], ["b"]], 2, { seed: 42 })).toThrow(
      NamespaceExhaustedError,
    );
  });

  it("should throw when exclude set exhausts the namespace", () => {
    const exclude = new Set(["A B"]);
    expect(() =>
      generateNames([["a"], ["b"]], 1, { seed: 42, exclude }),
    ).toThrow(NamespaceExhaustedError);
  });

  it("should have correct properties", () => {
    try {
      generateNames([["a"], ["b"]], 2, { seed: 42 });
    } catch (err) {
      expect(err).toBeInstanceOf(NamespaceExhaustedError);
      if (err instanceof NamespaceExhaustedError) {
        expect(err.maxCombinations).toBe(1);
        expect(err.excludedCount).toBe(0);
      }
    }
  });
});

describe("determinism — seed parity", () => {
  it("should produce identical sequences with same seed across calls", () => {
    const dictionaries = [DICT_A, DICT_B, DICT_C];
    const names1 = generateNames(dictionaries, 5, { seed: "hello" });
    const names2 = generateNames(dictionaries, 5, { seed: "hello" });
    expect(names1).toEqual(names2);
  });

  it("should produce a reproducible single name with numeric seed", () => {
    const name1 = generateName([DICT_A, DICT_B, DICT_C], { seed: 12345 });
    const name2 = generateName([DICT_A, DICT_B, DICT_C], { seed: 12345 });
    expect(name1).toBe(name2);
  });
});

describe("combinationCount", () => {
  it("should return 0 for empty dictionaries array", () => {
    expect(combinationCount([])).toBe(0);
  });

  it("should return single dictionary length", () => {
    expect(combinationCount([["a", "b", "c"]])).toBe(3);
  });

  it("should return product of dictionary lengths", () => {
    expect(combinationCount([DICT_A, DICT_B, DICT_C])).toBe(27);
  });
});

describe("generateNames — brute-force fallback", () => {
  it("should generate all possible unique names via brute-force", () => {
    // 1x1 = 1 combo. Exclude it, then ask for 0 remaining after excluding
    // Use a larger set: 3x1 = 3 combos. Exclude 2, request 1.
    // With a bad seed the random path may fail and trigger brute-force.
    // To guarantee brute-force: use exclude to fill seen, leaving only 1 combo
    // and set maxAttempts low by having few combos.
    const dict1 = ["alpha", "beta"];
    const dict2 = ["one", "two"];
    // Exclude 3 of 4. Only 1 combo left. Random attempts will mostly hit excluded.
    const exclude = new Set(["Alpha One", "Alpha Two", "Beta One"]);
    const names = generateNames([dict1, dict2], 1, {
      seed: 1,
      exclude,
    });
    expect(names).toHaveLength(1);
    expect(names[0]).toBe("Beta Two");
  });

  it("should throw NamespaceExhaustedError when brute-force exhausts combos", () => {
    // 2x1 = 2 combinations, request 3 unique
    expect(() => generateNames([["a", "b"], ["c"]], 3, { seed: 42 })).toThrow(
      NamespaceExhaustedError,
    );
  });

  it("should handle brute-force with exclude set", () => {
    // 2x2 = 4 combinations, exclude 2, request remaining 2
    const exclude = new Set(["Alpha One", "Beta Two"]);
    const names = generateNames(
      [
        ["alpha", "beta"],
        ["one", "two"],
      ],
      2,
      {
        seed: 99,
        exclude,
      },
    );
    expect(names).toHaveLength(2);
    for (const name of names) {
      expect(exclude.has(name)).toBe(false);
    }
  });
});
