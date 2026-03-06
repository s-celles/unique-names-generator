# User Guide

## Installation

```bash
npm install @scelles/unique-names-generator
```

## Quick Start

```ts
import { generateName, generateNames } from "@scelles/unique-names-generator";
import { ADJECTIVES, ANIMALS, COLORS } from "@scelles/unique-names-generator/dictionaries";

// Generate a single name
const name = generateName([ADJECTIVES, COLORS, ANIMALS]);
// e.g. "Swift Emerald Falcon"

// Generate multiple unique names
const names = generateNames([ADJECTIVES, COLORS, ANIMALS], 5);
// e.g. ["Swift Emerald Falcon", "Bold Crimson Otter", ...]
```

## API

### `generateName(dictionaries, options?)`

Generate a single random name by picking one word from each dictionary.

**Parameters:**

| Parameter      | Type         | Description                          |
| -------------- | ------------ | ------------------------------------ |
| `dictionaries` | `string[][]` | Ordered array of word lists          |
| `options`      | `GenerateOptions` | Optional generation options     |

**Options:**

| Option      | Type               | Default     | Description                     |
| ----------- | ------------------ | ----------- | ------------------------------- |
| `separator` | `string`           | `" "`       | Word separator                  |
| `style`     | `Style`            | `"capital"` | Formatting style                |
| `seed`      | `number \| string` | `undefined` | Seed for deterministic output   |

**Returns:** `string`

### `generateNames(dictionaries, n, options?)`

Generate `n` names. When `unique` is `true` (default), all names are distinct.

**Parameters:**

| Parameter      | Type           | Description                        |
| -------------- | -------------- | ---------------------------------- |
| `dictionaries` | `string[][]`   | Ordered array of word lists        |
| `n`            | `number`       | Number of names to generate        |
| `options`      | `BatchOptions` | Optional batch generation options  |

**Additional Options (extends `GenerateOptions`):**

| Option    | Type          | Default | Description                          |
| --------- | ------------- | ------- | ------------------------------------ |
| `unique`  | `boolean`     | `true`  | Whether names must be unique         |
| `exclude` | `Set<string>` | —       | Set of names to exclude              |

**Returns:** `string[]`

**Throws:** `NamespaceExhaustedError` when requesting more unique names than available combinations.

### `loadDictionary(pathOrUrl, resourceName)`

Load a dictionary from a [Frictionless Data Package](https://specs.frictionlessdata.io/data-package/) descriptor.

**Parameters:**

| Parameter      | Type     | Description                                     |
| -------------- | -------- | ----------------------------------------------- |
| `pathOrUrl`    | `string` | Path or URL to `datapackage.json`               |
| `resourceName` | `string` | Name of the resource within the data package    |

**Returns:** `Promise<string[]>`

```ts
import { loadDictionary } from "@scelles/unique-names-generator";

const animals = await loadDictionary(
  "https://raw.githubusercontent.com/andreasonny83/unique-names-data/main/datapackage.json",
  "animals",
);
```

### `combinationCount(dictionaries)`

Returns the total number of possible name combinations.

```ts
import { combinationCount } from "@scelles/unique-names-generator";

const total = combinationCount([adjectives, colors, animals]);
```

## Styles

| Style         | Example                  |
| ------------- | ------------------------ |
| `"lowercase"` | `"swift emerald falcon"` |
| `"capital"`   | `"Swift Emerald Falcon"` |
| `"uppercase"` | `"SWIFT EMERALD FALCON"` |

## Deterministic Generation

Pass a `seed` to get reproducible results:

```ts
const name1 = generateName([ADJECTIVES, ANIMALS], { seed: 42 });
const name2 = generateName([ADJECTIVES, ANIMALS], { seed: 42 });
// name1 === name2 (always)
```

The PRNG uses the **alea** algorithm from `seedrandom`, producing sequences compatible with the [Julia implementation](https://github.com/s-celles/UniqueNamesGenerator.jl).

## Bundled Dictionaries

The following dictionaries are available from `@scelles/unique-names-generator/dictionaries`:

| Export        | Description              |
| ------------- | ------------------------ |
| `ADJECTIVES`  | Descriptive adjectives   |
| `ANIMALS`     | Animal names             |
| `COLORS`      | Color names              |
| `CELESTIAL`   | Celestial body names     |
| `NATURE`      | Nature-related words     |
| `SCIENCE`     | Science-related terms    |
| `NUMBERS`     | Number words             |
| `NATO`        | NATO phonetic alphabet   |
| `NOUNS`       | Common nouns             |

These are auto-generated from the [unique-names-data](https://github.com/andreasonny83/unique-names-data) Frictionless Data Package.

## Error Handling

```ts
import { generateNames, NamespaceExhaustedError } from "@scelles/unique-names-generator";

try {
  generateNames([["a", "b"], ["c"]], 5, { unique: true });
} catch (e) {
  if (e instanceof NamespaceExhaustedError) {
    console.log(`Only ${e.maxCombinations} combinations available`);
  }
}
```
