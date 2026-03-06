# Security Policy

## Supported Versions

| Version | Supported          |
|---------|--------------------|
| latest  | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability, please report it responsibly:

1. **Do NOT open a public issue.**
2. Email the maintainer or use [GitHub's private vulnerability reporting](https://github.com/s-celles/unique-names-generator/security/advisories/new).
3. Include a description of the vulnerability and steps to reproduce.

We will acknowledge receipt within 48 hours and provide an estimated timeline for a fix.

## Scope

This package generates pseudonyms from word lists. Security considerations include:

- **Content moderation:** Offensive word combinations are mitigated via the [blocklist](https://github.com/s-celles/unique-names-data) in the data package.
- **Determinism:** Seeded generation is for reproducibility, not cryptographic security. Do not use generated names as secrets or tokens.
