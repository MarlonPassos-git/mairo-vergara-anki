## Getting Started

### Runtime

- pnpm: `10.33.0`, pinned by `packageManager` in `package.json`.
- Node: required for template sync and docs generation scripts.
- Biome: used through `pnpm lint` and `pnpm lint:fix`.
- AnkiConnect: required for commands that talk to Anki.

### Installation

```powershell
corepack enable
pnpm install
```

## Development

```powershell
pnpm lint
pnpm lint:fix
pnpm sync
```

`pnpm sync` applies `templates/basic-editorial-v2` through AnkiConnect with `--create-if-missing`.

## Documentation

Long notes belong in `docs/`. Each template lives in its own folder under `templates/` with separate front, back, styling, model, and example files.

Update [README.md](README.md) when commands, template versions, fields, or setup steps change.

## Pull Requests

- Keep changes focused on one concern.
- Update docs with behavior, command, or setup changes.
- Update [CHANGELOG.md](CHANGELOG.md) when user-facing template behavior, commands, or setup steps change.
- Run the relevant checks before opening a pull request.
- Include screenshots or recordings for visible UI changes.

## Commit Style

Use Conventional Commits:

```text
feat(scope): add new behavior
fix(scope): correct broken behavior
docs(scope): update documentation
```
