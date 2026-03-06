import { describe, it, expect } from "vitest";
import { loadDictionary } from "../src/index.js";

const DATAPACKAGE_URL =
  "https://raw.githubusercontent.com/s-celles/unique-names-data/main/datapackage.json";

describe("loadDictionary", () => {
  it("should load adjectives from remote datapackage.json", async () => {
    const words = await loadDictionary(DATAPACKAGE_URL, "adjectives");
    expect(words.length).toBeGreaterThan(0);
    expect(words.every((w) => typeof w === "string")).toBe(true);
  }, 30000);

  it("should load animals from remote datapackage.json", async () => {
    const words = await loadDictionary(DATAPACKAGE_URL, "animals");
    expect(words.length).toBeGreaterThan(0);
  }, 30000);

  it("should throw for non-existent resource", async () => {
    await expect(
      loadDictionary(DATAPACKAGE_URL, "nonexistent"),
    ).rejects.toThrow('Resource "nonexistent" not found');
  }, 30000);
});
