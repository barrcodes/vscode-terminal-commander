import * as vscode from 'vscode';

const registry = new Map<string, vscode.Terminal>();

function getTerminal(name: string): vscode.Terminal | undefined {
  const terminal = registry.get(name);
  if (terminal && terminal.exitStatus !== undefined) {
    registry.delete(name);
    return undefined;
  }
  return terminal;
}

function registerTerminal(name: string, terminal: vscode.Terminal): void {
  const existing = registry.get(name);
  if (existing && existing.exitStatus === undefined) {
    existing.dispose();
  }
  registry.set(name, terminal);
}

export function activate(context: vscode.ExtensionContext): void {
  context.subscriptions.push(
    vscode.window.onDidCloseTerminal((closed) => {
      for (const [name, terminal] of registry) {
        if (terminal === closed) {
          registry.delete(name);
          break;
        }
      }
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      'terminalManager.createByName',
      (args: { name?: string; command?: string } = {}) => {
        if (!args.name) {
          vscode.window.showErrorMessage('terminalManager.createByName: "name" argument is required');
          return;
        }
        const existing = getTerminal(args.name);
        const terminal = existing ?? vscode.window.createTerminal({ name: args.name });
        if (!existing) {
          registerTerminal(args.name, terminal);
        }
        terminal.show();
        if (args.command) {
          terminal.sendText(args.command);
        }
      }
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      'terminalManager.splitByName',
      async (args: { name?: string; parentName?: string; command?: string } = {}) => {
        if (!args.name) {
          vscode.window.showErrorMessage('terminalManager.splitByName: "name" argument is required');
          return;
        }
        const parent =
          (args.parentName ? getTerminal(args.parentName) : undefined) ??
          vscode.window.activeTerminal;
        if (!parent) {
          vscode.window.showErrorMessage('terminalManager.splitByName: no active terminal to split');
          return;
        }
        parent.show(true);
        const opened = new Promise<vscode.Terminal>(resolve => {
          const disposable = vscode.window.onDidOpenTerminal(t => {
            disposable.dispose();
            resolve(t);
          });
        });
        await vscode.commands.executeCommand('workbench.action.terminal.split');
        const terminal = await opened;
        registerTerminal(args.name, terminal);
        await vscode.commands.executeCommand('workbench.action.terminal.renameWithArg', { name: args.name });
        if (args.command) {
          terminal.sendText(args.command);
        }
      }
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      'terminalManager.focusByName',
      (args: { name?: string } = {}) => {
        if (!args.name) {
          vscode.window.showErrorMessage('terminalManager.focusByName: "name" argument is required');
          return;
        }
        const terminal = getTerminal(args.name);
        if (!terminal) {
          vscode.window.showErrorMessage(`terminalManager.focusByName: no terminal named "${args.name}"`);
          return;
        }
        terminal.show();
      }
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      'terminalManager.sendByName',
      (args: { name?: string; text?: string } = {}) => {
        if (!args.name || args.text === undefined) {
          vscode.window.showErrorMessage('terminalManager.sendByName: "name" and "text" arguments are required');
          return;
        }
        const terminal = getTerminal(args.name);
        if (!terminal) {
          vscode.window.showErrorMessage(`terminalManager.sendByName: no terminal named "${args.name}"`);
          return;
        }
        terminal.show();
        terminal.sendText(args.text);
      }
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      'terminalManager.closeByName',
      (args: { name?: string } = {}) => {
        if (!args.name) {
          vscode.window.showErrorMessage('terminalManager.closeByName: "name" argument is required');
          return;
        }
        const terminal = getTerminal(args.name);
        if (!terminal) {
          vscode.window.showErrorMessage(`terminalManager.closeByName: no terminal named "${args.name}"`);
          return;
        }
        terminal.dispose();
        registry.delete(args.name);
      }
    )
  );
}

export function deactivate(): void {
  for (const terminal of registry.values()) {
    terminal.dispose();
  }
  registry.clear();
}
