# Contributing

## Setup

```bash
bun install
```

Press `F5` to launch the Extension Development Host. The `bun: watch` task compiles on save.

```bash
bun run compile   # one-shot build
bun run package   # produces .vsix
```

## Architecture

Terminals are tracked in a module-scope `Map<string, vscode.Terminal>` in `src/extension.ts`. The registry self-cleans via `onDidCloseTerminal`. All commands surface errors as VS Code notifications rather than throwing.
