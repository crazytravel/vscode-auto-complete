"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const vscode_1 = require("vscode");
const rustKeyWords = ['struct', 'if', 'for', 'interface'];
var EditorAction;
(function (EditorAction) {
    EditorAction["InsertLineAfter"] = "editor.action.insertLineAfter";
    EditorAction["InsertLineBefore"] = "editor.action.insertLineBefore";
    EditorAction["OutdentLines"] = "editor.action.outdentLines";
})(EditorAction || (EditorAction = {}));
const matchRightBracket = () => {
    const editor = vscode.window.activeTextEditor;
    const lineNumber = editor.selection.active.line;
    const line = editor.document.lineAt(lineNumber);
    const lineText = line.text;
    let matched = false;
    rustKeyWords.forEach(element => {
        if (lineText.includes(element)) {
            appendCurlyBraceLeftAndRight();
            matched = true;
            return;
        }
    });
};
const appendCurlyBraceLeftAndRight = () => {
    const editor = vscode.window.activeTextEditor;
    const lineNumber = editor.selection.active.line;
    const line = editor.document.lineAt(lineNumber);
    const endPosition = line.range.end;
    editor.insertSnippet(new vscode_1.SnippetString(' {'), endPosition)
        .then(() => {
        appendCurlyBraceRight();
    });
};
const appendCurlyBraceRight = () => {
    const editor = vscode.window.activeTextEditor;
    vscode_1.commands.executeCommand(EditorAction.InsertLineAfter)
        .then(() => {
        editor.insertSnippet(new vscode_1.SnippetString('}'))
            .then(() => {
            vscode_1.commands.executeCommand(EditorAction.OutdentLines);
            vscode_1.commands.executeCommand(EditorAction.InsertLineBefore);
        });
    });
};
const appendComma = () => {
    const editor = vscode.window.activeTextEditor;
    editor.insertSnippet(new vscode_1.SnippetString(','));
    vscode_1.commands.executeCommand(EditorAction.InsertLineAfter);
};
const appendNewline = () => {
    const editor = vscode.window.activeTextEditor;
    editor.insertSnippet(new vscode_1.SnippetString('\r'));
    vscode_1.commands.executeCommand(EditorAction.InsertLineBefore);
};
const mapping = new Map();
mapping.set(')', matchRightBracket);
mapping.set('{', appendCurlyBraceRight);
mapping.set('}', appendNewline);
mapping.set(';', appendNewline);
mapping.set(',', appendNewline);
exports.matchGoReg = () => {
    const editor = vscode.window.activeTextEditor;
    const lineNumber = editor.selection.active.line;
    const line = editor.document.lineAt(lineNumber);
    const lineText = line.text;
    const lastEditChar = lineText.substr(-1);
    if (lineText.includes('struct')) {
        appendCurlyBraceLeftAndRight();
        return;
    }
    if (lineText.includes('interface')) {
        appendCurlyBraceLeftAndRight();
        return;
    }
    const func = mapping.get(lastEditChar);
    if (func) {
        func();
    }
};
//# sourceMappingURL=go.js.map