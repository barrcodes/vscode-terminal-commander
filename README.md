<div align="center">
  <img src="https://raw.githubusercontent.com/barrcodes/vscode-terminal-map/main/brand.png" alt="Terminal Map" width="256" />

  <p>Named terminal management for VS Code.</p>

[![Version](https://img.shields.io/visual-studio-marketplace/v/barrcodes.vscode-terminal-map?style=flat-square)](https://marketplace.visualstudio.com/items?itemName=barrcodes.vscode-terminal-map)
[![Installs](https://img.shields.io/visual-studio-marketplace/i/barrcodes.vscode-terminal-map?style=flat-square)](https://marketplace.visualstudio.com/items?itemName=barrcodes.vscode-terminal-map)
[![License](https://img.shields.io/github/license/barrcodes/vscode-terminal-map?style=flat-square)](./LICENSE)

</div>

---

VS Code's terminal API operates by index — fragile, order-dependent, and error-prone in any workflow beyond the basics. Terminal Map replaces that with names. Give each terminal a stable identity and drive it precisely. One focused extension, one thing done right.

## Commands

| Command                    | Description                                                                 | Required args  | Optional args           |
| -------------------------- | --------------------------------------------------------------------------- | -------------- | ----------------------- |
| `terminalMap.createByName` | Creates a terminal with the given name, or focuses it if it already exists. | `name`         | `command`               |
| `terminalMap.splitByName`  | Splits `parentName` (or the active terminal) and registers the new pane.    | `name`         | `parentName`, `command` |
| `terminalMap.focusByName`  | Brings the named terminal into focus.                                       | `name`         |                         |
| `terminalMap.sendByName`   | Sends text to the named terminal as if typed.                               | `name`, `text` |                         |
| `terminalMap.closeByName`  | Closes and disposes the named terminal.                                     | `name`         |                         |

## Usage

**Keybinding** (`keybindings.json`):

```json
{ "key": "ctrl+alt+1", "command": "terminalMap.createByName", "args": { "name": "dev", "command": "npm run dev\n" } }
{ "key": "ctrl+alt+2", "command": "terminalMap.splitByName",  "args": { "name": "logs", "parentName": "dev" } }
```

**Programmatic**:

```ts
vscode.commands.executeCommand("terminalMap.sendByName", {
  name: "dev",
  text: "npm test\n",
});
```

See [CONTRIBUTING.md](CONTRIBUTING.md) for dev setup and architecture.
