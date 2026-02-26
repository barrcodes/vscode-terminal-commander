# Terminal Commander

Named terminal management for VS Code. Create, split, focus, send, and close terminals by name from keybindings, extensions, or any command invoker.

VS Code's terminal API operates by index — fragile, order-dependent, and error-prone in any workflow beyond the basics. Terminal Commander replaces that with names. Give each terminal a stable identity and drive it precisely. One focused extension, one thing done right.

## Commands

| Command                        | Description                                                                 | Required args  | Optional args           |
| ------------------------------ | --------------------------------------------------------------------------- | -------------- | ----------------------- |
| `terminalManager.createByName` | Creates a terminal with the given name, or focuses it if it already exists. | `name`         | `command`               |
| `terminalManager.splitByName`  | Splits `parentName` (or the active terminal) and registers the new pane.    | `name`         | `parentName`, `command` |
| `terminalManager.focusByName`  | Brings the named terminal into focus.                                       | `name`         |                         |
| `terminalManager.sendByName`   | Sends text to the named terminal as if typed.                               | `name`, `text` |                         |
| `terminalManager.closeByName`  | Closes and disposes the named terminal.                                     | `name`         |                         |

## Usage

**Keybinding** (`keybindings.json`):

```json
{ "key": "ctrl+alt+1", "command": "terminalManager.createByName", "args": { "name": "dev", "command": "npm run dev\n" } }
{ "key": "ctrl+alt+2", "command": "terminalManager.splitByName",  "args": { "name": "logs", "parentName": "dev" } }
```

**Programmatic**:

```ts
vscode.commands.executeCommand("terminalManager.sendByName", {
  name: "dev",
  text: "npm test\n",
});
```

See [CONTRIBUTING.md](CONTRIBUTING.md) for dev setup and architecture.
