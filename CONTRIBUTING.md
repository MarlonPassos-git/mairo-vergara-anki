<!-- setup-standard:start -->
<div align="center">
  <img src="https://placehold.co/96x96?text=ICON" alt="mairo-vergara-anki icon" width="72" height="72" />

  <h1>Contributing to mairo-vergara-anki</h1>

  <p>Thanks for helping improve this project.</p>
</div>

## Getting Started

### Runtime

- Node: `>=24.0.0`
- pnpm: `>=10.0.0`
- Package manager: pinned by `packageManager` in `package.json`
- RTK: required for package scripts and CI

### Installation

```powershell
corepack enable
pnpm install
pnpm hooks:install
```

## Development

```powershell
pnpm dev
pnpm build
pnpm lint
pnpm lint:ci
pnpm type-check
pnpm test
pnpm test:ci
pnpm test:unit
pnpm sonar:local
```

Run these only when the project has integration or E2E coverage:

```powershell
pnpm test:integration
pnpm test:e2e
```

## Documentation

If this project has a `docs/` folder, start with its index before changing behavior or public APIs.

## Tests

- Use `*.unit.spec.ts` for unit tests.
- Use `*.integration.spec.ts` for integration tests when the project has integration coverage.
- Use `*.e2e.spec.ts` for end-to-end tests when the project has E2E coverage.
- Prefer colocated `__tests__/` folders beside the code under test.
- Keep tests fast, independent, repeatable, self-validating, and timely.
- Mock external I/O with named fake classes, not inline stubs.

## Pull Requests

- Keep changes focused on one concern.
- Update tests and docs with the code change.
- Run the relevant checks before opening a pull request.
- Include screenshots or recordings for visible UI changes.

## Commit Style

Use Conventional Commits:

```text
feat(scope): add new behavior
fix(scope): correct broken behavior
docs(scope): update documentation
```

## Hooks

Lefthook runs Biome on staged files before commit and stages fixed files again.

```powershell
pnpm hooks:install
```

## SonarQube

`sonar-project.properties` is prepared for a local SonarQube server at `http://localhost:9000`.

TODO: create a separate infrastructure repository with Docker-based SonarQube local setup.

## Optional Checks

Use Knip only when the project benefits from unused dependency and export checks.
<!-- setup-standard:end -->
