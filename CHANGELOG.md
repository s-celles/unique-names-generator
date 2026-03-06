# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/),
and this project adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased]

## [0.1.0] - 2026-03-06

### Added

- Initial project structure with TypeScript, tsup, ESLint, Prettier, Vitest
- `generateName()` — single name generation with configurable style, separator, and seed
- `generateNames()` — batch generation with uniqueness constraints and exclusion sets
- `loadDictionary()` — load dictionaries from Frictionless Data Package descriptors via `datapackage` library
- `NamespaceExhaustedError` — thrown when all name combinations are exhausted
- Built-in dictionaries: ADJECTIVES, ANIMALS, COLORS, CELESTIAL, NATURE, SCIENCE, NUMBERS, NATO, NOUNS
- Build script to generate TypeScript dictionary constants from `unique-names-data` repository
- GitHub Actions CI/CD: lint, test, build, release, dictionary auto-update
- TypeDoc API documentation
- Deterministic PRNG via `seedrandom` for sequence parity with Julia implementation
