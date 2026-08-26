# Contributing to Shortle

Thank you for your interest in contributing to Shortle! This guide will help you get started.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Commit Messages](#commit-messages)
- [Reporting Bugs](#reporting-bugs)
- [Requesting Features](#requesting-features)

## Code of Conduct

Please read our [Code of Conduct](CODE_OF_CONDUCT.md) before contributing. We expect all contributors to follow it.

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- PostgreSQL (local or hosted)
- Git

### Setup

1. Fork the repository on GitHub

2. Clone your fork:

```bash
git clone https://github.com/<your-username>/shortle.git
cd shortle
```

3. Install dependencies:

```bash
npm install
```

4. Set up environment variables:

```bash
cp .env.example .env
# Edit .env with your database URL
```

5. Set up the database:

```bash
npx prisma db push
```

6. Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

## Development Workflow

### Branch Naming

Use descriptive branch names:

| Type       | Format                    | Example                    |
| ---------- | ------------------------- | -------------------------- |
| Feature    | `feature/<description>`   | `feature/add-qr-codes`     |
| Bug Fix    | `fix/<description>`       | `fix/redirect-expired`     |
| Docs       | `docs/<description>`      | `docs/update-api-guide`    |
| Refactor   | `refactor/<description>`  | `refactor/prisma-queries`  |

### Making Changes

1. Create a new branch from `main`:

```bash
git checkout -b feature/my-feature
```

2. Make your changes
3. Run the linter:

```bash
npm run lint
```

4. Test your changes locally
5. Commit your changes (see [Commit Messages](#commit-messages))
6. Push to your fork:

```bash
git push origin feature/my-feature
```

7. Open a Pull Request

## Pull Request Process

1. **Fill out the PR template** completely
2. **Link related issues** (e.g., "Closes #12")
3. **Ensure CI passes** — linting and build must succeed
4. **Request review** from a maintainer
5. **Address feedback** promptly

### PR Checklist

- [ ] Code follows project conventions
- [ ] Linter passes (`npm run lint`)
- [ ] Build succeeds (`npm run build`)
- [ ] New features are documented
- [ ] No sensitive data (API keys, passwords) is committed

## Coding Standards

### TypeScript

- Use strict TypeScript — avoid `any` types
- Define interfaces/types in `lib/types.ts`
- Use meaningful variable and function names

### React Components

- Use functional components with hooks
- Keep components focused — single responsibility
- Place shared components in `components/ui/`

### Styling

- Use Tailwind CSS v4 utility classes (CSS-first configuration)
- Follow the existing color palette system — 5 palettes defined in `globals.css`:
  - Colors are defined via CSS custom properties in `:root` (light) and `.dark` (dark)
  - Palette variants use `[data-palette="..."]` selectors
  - Utility classes reference variables via `@theme inline` (e.g., `text-primary` → `var(--primary)`)
  - Never hardcode colors — always use CSS variable references

### API Routes

- Validate all inputs
- Return consistent error shapes: `{ error: string }`
- Use appropriate HTTP status codes

### Database

- Use Prisma for all database queries
- Never write raw SQL unless absolutely necessary
- Add indexes for frequently queried fields

## Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>: <description>

[optional body]

[optional footer(s)]
```

### Types

| Type       | Description                                      |
| ---------- | ------------------------------------------------ |
| `feat`     | New feature                                      |
| `fix`      | Bug fix                                          |
| `docs`     | Documentation changes                            |
| `style`    | Code style changes (formatting, no logic change) |
| `refactor` | Code refactoring (no feature or fix)             |
| `test`     | Adding or updating tests                         |
| `chore`    | Build process or auxiliary tool changes           |

### Examples

```
feat: add QR code generation for short links

fix: prevent redirect loop for expired links

docs: update API reference with new endpoints

refactor: extract click tracking into separate module
```

## Reporting Bugs

### Before Reporting

1. Search existing issues for duplicates
2. Reproduce the bug on the latest `main` branch

### Bug Report Template

```markdown
**Describe the bug**
A clear description of what the bug is.

**To reproduce**

1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment**

- OS: [e.g., Windows 11]
- Browser: [e.g., Chrome 120]
- Node version: [e.g., 20.10.0]
```

## Requesting Features

### Feature Request Template

```markdown
**Is your feature request related to a problem?**
A clear description of the problem. Ex. "I'm always frustrated when..."

**Describe the solution you'd like**
What you want to happen.

**Describe alternatives you've considered**
Other solutions or features you've thought about.

**Additional context**
Any other context or screenshots.
```

## Questions?

Open a [GitHub Discussion](https://github.com/md-zeon/shortle/discussions) for general questions.
