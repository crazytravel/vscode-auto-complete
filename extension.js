// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "vscode-auto-complete" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('extension.helloWorld', function () {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World!');
	});

	let autoComplete = vscode.commands.registerTextEditorCommand('extension.vscodeAutoComplete', function (textEditor, edit) {
		vscode.window.showInformationMessage('Auto Complete is worked');
		let position = textEditor.selection.active;
		let lineNumber = position.line;
		const line = textEditor.document.lineAt(lineNumber);
		intelligentAutoComplete(edit, line);
	});

	const intelligentAutoComplete = function (edit, line) {
		const editor = vscode.window.activeTextEditor;
		const lang = editor.document.languageId;
		const lineText = line.text;
		const position = line.range.end;
		console.log('language_id: ', lang);
		console.log('line_text:', lineText);
		switch (lang) {
			case 'javascript':
				edit.insert(position, ";");
				break;
			case 'java':
				edit.insert(position, ";");
				break;
			case 'rust':
				rustAutoComplete(lineText, position);
				break;
			default:
				console.log('%s language not implemented by vscode-auto-complete', lang);
				break;
		}
	}

	const rustAutoComplete = function (lineText, position) {
		const editor = vscode.window.activeTextEditor;
		const lastChar = lineText.substr(-1);
		switch (lastChar) {
			case ')':
				if (lineText.indexOf('fn') != -1 
				|| lineText.indexOf('if') != -1
				|| lineText.indexOf('for') != -1
				|| lineText.indexOf('match') != -1) {
					editor.insertSnippet(new vscode.SnippetString('{'), position);
					vscode.commands.executeCommand('editor.action.insertLineAfter').then(function () {
						editor.insertSnippet(new vscode.SnippetString('}'));
						vscode.commands.executeCommand('editor.action.outdentLines');
						vscode.commands.executeCommand('editor.action.insertLineBefore');
					});
				} else {
					editor.insertSnippet(new vscode.SnippetString(';'), position);
					vscode.commands.executeCommand('editor.action.insertLineAfter');
				}
				break;
			case '{':
				console.log('The last char is [{] , just jump to new line');
				vscode.commands.executeCommand('editor.action.insertLineAfter').then(function () {
					editor.insertSnippet(new vscode.SnippetString('}'));
					vscode.commands.executeCommand('editor.action.outdentLines');
					vscode.commands.executeCommand('editor.action.insertLineBefore');
				});
				break;
			case '}':
				console.log('The last char is }');
				editor.insertSnippet(new vscode.SnippetString('\r'));
				vscode.commands.executeCommand('editor.action.insertLineBefore');
				break;
			case ';':
				console.log('The last char is [;] , just jump to new line');
				vscode.commands.executeCommand('editor.action.insertLineAfter');
				break;
			case ',':
				console.log('The last char is [,] , just jump to new line');
				// edit.insert(position, '\r\n');
				vscode.commands.executeCommand('editor.action.insertLineAfter');
				break;
			default:
				editor.insertSnippet(new vscode.SnippetString(';'), position);
				vscode.commands.executeCommand('editor.action.insertLineAfter');
				break;
		}

	}

	context.subscriptions.push(disposable);
	context.subscriptions.push(autoComplete);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() { }

module.exports = {
	activate,
	deactivate
}
