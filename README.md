# @scelles/unique-names-generator

A generic, type-safe, and deterministic pseudonym generator in TypeScript.

Inspired by [unique-names-generator](https://github.com/andreasonny83/unique-names-generator) with a clean separation between **code** and **data** ([issue #82](https://github.com/andreasonny83/unique-names-generator/issues/82)). Dictionary data comes from [unique-names-data](https://github.com/s-celles/unique-names-data), a Frictionless Data Package.

## Features

- **Dictionary-agnostic** — accepts any ordered array of `string[][]`
- **Deterministic** — seeded PRNG for reproducible name sequences
- **Type-safe** — full TypeScript support with exported types
- **Data Package integration** — uses the `datapackage` library
- **Tree-shakable dictionaries** — built-in word lists as constants
- **Multiple styles** — `lowercase`, `capital`, `uppercase`
- **Batch generation** — with uniqueness constraints and exclusion sets

## Installation

```bash
npm install @scelles/unique-names-generator
```

## Quick Start

```ts
import { generateName, generateNames } from "@scelles/unique-names-generator";
import {
  ADJECTIVES,
  COLORS,
  ANIMALS,
} from "@scelles/unique-names-generator/dictionaries";

// Generate a single name
const name = generateName([ADJECTIVES, COLORS, ANIMALS]);
// => "Swift Emerald Falcon"

// Deterministic with seed
const name2 = generateName([ADJECTIVES, COLORS, ANIMALS], { seed: 42 });
// Always returns the same name for seed 42

// Batch generation
const names = generateNames([ADJECTIVES, COLORS, ANIMALS], 5, {
  seed: 42,
  unique: true,
});
```

## API

### `generateName(dictionaries, options?)`

Generate a single random name by picking one word from each dictionary.

**Parameters:**

- `dictionaries: string[][]` — ordered array of word lists
- `options.separator?: string` — word separator (default: `" "`)
- `options.style?: "lowercase" | "capital" | "uppercase"` — formatting (default: `"capital"`)
- `options.seed?: number | string` — seed for deterministic output

### `generateNames(dictionaries, n, options?)`

Generate `n` names.

**Parameters:**

- `dictionaries: string[][]` — ordered array of word lists
- `n: number` — number of names to generate
- `options.unique?: boolean` — ensure all names are unique (default: `true`)
- `options.exclude?: Set<string>` — names to exclude from generation
- Plus all `generateName` options

**Throws:** `NamespaceExhaustedError` when all combinations are exhausted.

### `loadDictionary(pathOrUrl, resourceName)`

Load a dictionary from a Frictionless Data Package descriptor.

**Parameters:**

- `pathOrUrl: string` — path or URL to a `datapackage.json`
- `resourceName: string` — name of the resource to extract

```ts
import { loadDictionary } from "@scelles/unique-names-generator";

const adjectives = await loadDictionary(
  "https://raw.githubusercontent.com/s-celles/unique-names-data/main/datapackage.json",
  "adjectives",
);
```

## Built-in Dictionaries

Available via `@scelles/unique-names-generator/dictionaries`:

| Constant     | Description                                  |
| ------------ | -------------------------------------------- |
| `ADJECTIVES` | General adjectives (traits, qualities)       |
| `COLORS`     | Color names                                  |
| `ANIMALS`    | Animal species                               |
| `CELESTIAL`  | Space and astronomy terms                    |
| `NATURE`     | Natural elements and phenomena               |
| `SCIENCE`    | Scientific terms                             |
| `NUMBERS`    | Numeric strings (0–99)                       |
| `NATO`       | NATO phonetic alphabet                       |
| `NOUNS`      | Union of animals, celestial, science, nature |

## Related Projects

- [unique-names-data](https://github.com/s-celles/unique-names-data) — canonical word lists (Frictionless Data Package)
- [UniqueNamesGenerator.jl](https://github.com/s-celles/UniqueNamesGenerator.jl) — Julia implementation
- [unique-names-generator](https://github.com/andreasonny83/unique-names-generator) — original JavaScript package

## License

[MIT](LICENSE)
