"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const rust_1 = require("./lang/rust");
const dart_1 = require("./lang/dart");
const typescript_1 = require("./lang/typescript");
const go_1 = require("./lang/go");
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "vscode-auto-complete" is now active!');
    let autComplete = vscode.commands.registerTextEditorCommand('extension.vscodeAutoComplete', () => {
        const editor = vscode.window.activeTextEditor;
        const langId = editor.document.languageId;
        switch (langId) {
            case 'javascript':
                typescript_1.matchTypescriptReg();
                break;
            case 'typescript':
                typescript_1.matchTypescriptReg();
                break;
            case 'go':
                go_1.matchGoReg();
                break;
            case 'dart':
                dart_1.matchDartReg();
                break;
            case 'rust':
                rust_1.matchRustReg();
                break;
            default:
                console.log('programming language %s not implement yet.', langId);
                break;
        }
    });
    context.subscriptions.push(autComplete);
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map