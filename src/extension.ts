// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { valuePrompter, MyCodeLensProvider } from './lens';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "pre-flight-vscode" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let helloWorldDisposable = vscode.commands.registerCommand('extension.helloWorld', () => {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World!');
	});

	// Register the line prompter command
	let valuePromptDisposable = vscode.commands.registerCommand('extension.valuePrompter', valuePrompter);

	// Create a codeLens provider for untitled documents
	let codeLensDocSelector = {
		scheme: 'untitled'
	};
	let codeLensDisposable = vscode.languages.registerCodeLensProvider(codeLensDocSelector, new MyCodeLensProvider());

	// Push the disposables from registration onto the subscriptions
	context.subscriptions.push(helloWorldDisposable);
	context.subscriptions.push(valuePromptDisposable);
	context.subscriptions.push(codeLensDisposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
