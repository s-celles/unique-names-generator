# Contributing to @scelles/unique-names-generator

Thank you for your interest in contributing!

## Development Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/s-celles/unique-names-generator.git
   cd unique-names-generator
   ```

2. **Install dependencies:**

   ```bash
   npm install --ignore-scripts
   ```

3. **Build dictionaries** (requires internet access):

   ```bash
   npm run build:dictionaries
   ```

4. **Build the package:**

   ```bash
   npm run build
   ```

5. **Run tests:**

   ```bash
   npm test
   ```

## Conventional Commits

All commits **must** follow the [Conventional Commits](https://www.conventionalcommits.org/) specification. This enables automated version inference by `semantic-release`.

### Commit Types

| Type       | Description                              | Version Bump |
|-----------|------------------------------------------|-------------|
| `feat:`    | A new feature                            | Minor        |
| `fix:`     | A bug fix                                | Patch        |
| `docs:`    | Documentation changes                    | —            |
| `test:`    | Adding or updating tests                 | —            |
| `chore:`   | Maintenance tasks                        | —            |
| `refactor:` | Code refactoring                        | —            |
| `BREAKING CHANGE:` | Breaking API change (in footer) | Major        |

### Examples

```
feat: add star-names dictionary
fix: correct case-insensitive comparison in exclusion set
docs: update API reference for loadDictionary
test: add parity tests for seed=42
chore: update devDependencies
```

## Pull Request Process

1. Fork the repository and create a feature branch from `main`.
2. Make your changes following the coding standards.
3. Run all checks locally:

   ```bash
   npm run lint
   npm run format:check
   npm run typecheck
   npm test
   ```

4. Open a pull request against `main`.
5. All CI checks must pass before merging.
6. At least one approved review is required.

## Code Style

- **Formatter:** Prettier (run `npm run format` to auto-fix)
- **Linter:** ESLint with `typescript-eslint`
- **Language:** TypeScript with strict mode

## Adding Dictionaries

Dictionary word lists live in the [unique-names-data](https://github.com/s-celles/unique-names-data) repository. To add new words or dictionaries, please contribute there.

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).
