import { defineConfig } from "tsup";

export default defineConfig([
  {
    entry: ["src/index.ts"],
    format: ["cjs", "esm"],
    dts: true,
    sourcemap: true,
    clean: true,
    outDir: "dist",
  },
  {
    entry: ["src/dictionaries/index.ts"],
    format: ["cjs", "esm"],
    dts: true,
    sourcemap: true,
    outDir: "dist/dictionaries",
  },
]);
