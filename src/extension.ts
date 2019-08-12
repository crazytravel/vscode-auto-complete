// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { TextEditor } from 'vscode';
import { matchRustReg } from './lang/rust';
import { matchDartReg } from './lang/dart';
import { matchTypescriptReg } from './lang/typescript';
import { matchGoReg } from './lang/go';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "vscode-auto-complete" is now active!');

	let autComplete = vscode.commands.registerTextEditorCommand('extension.vscodeAutoComplete', () => {
		const editor: TextEditor = vscode.window.activeTextEditor!;
		const langId: string = editor.document.languageId;
		switch (langId) {
			case 'javascript':
				matchTypescriptReg();
				break;
			case 'typescript':
				matchTypescriptReg();
				break;
			case 'go':
				matchGoReg();
				break;
			case 'dart':
				matchDartReg();
				break;
			case 'rust':
				matchRustReg();
				break;
			default:
				console.log('programming language %s not implement yet.', langId);
				break;
		}
	}
	);
	context.subscriptions.push(autComplete);
}

// this method is called when your extension is deactivated
export function deactivate() { }
