import * as vscode from 'vscode';
import { TextEditor, TextLine, Position, SnippetString, commands } from 'vscode';

const rustKeyWords: string[] = ['struct', 'if', 'for', 'interface'];

enum EditorAction {
    InsertLineAfter = 'editor.action.insertLineAfter',
    InsertLineBefore = 'editor.action.insertLineBefore',
    OutdentLines = 'editor.action.outdentLines',
}


const matchRightBracket = () => {
    const editor: TextEditor = vscode.window.activeTextEditor!;
    const lineNumber: number = editor.selection.active.line;
    const line: TextLine = editor.document.lineAt(lineNumber);
    const lineText: string = line.text;
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
    const editor: TextEditor = vscode.window.activeTextEditor!;
    const lineNumber: number = editor.selection.active.line;
    const line: TextLine = editor.document.lineAt(lineNumber);
    const endPosition: Position = line.range.end;
    editor.insertSnippet(new SnippetString(' {'), endPosition)
        .then(() => {
            appendCurlyBraceRight();
        });
};

const appendCurlyBraceRight = () => {
    const editor: TextEditor = vscode.window.activeTextEditor!;
    commands.executeCommand(EditorAction.InsertLineAfter)
        .then(() => {
            editor.insertSnippet(new SnippetString('}'))
                .then(() => {
                    commands.executeCommand(EditorAction.OutdentLines);
                    commands.executeCommand(EditorAction.InsertLineBefore);
                });
        });
};

const appendComma = () => {
    const editor: TextEditor = vscode.window.activeTextEditor!;
    editor.insertSnippet(new SnippetString(','));
    commands.executeCommand(EditorAction.InsertLineAfter);
};

const appendNewline = () => {
    const editor: TextEditor = vscode.window.activeTextEditor!;
    editor.insertSnippet(new SnippetString('\r'));
    commands.executeCommand(EditorAction.InsertLineBefore);
};



const mapping: Map<string, Function> = new Map();
mapping.set(')', matchRightBracket);
mapping.set('{', appendCurlyBraceRight);
mapping.set('}', appendNewline);
mapping.set(';', appendNewline);
mapping.set(',', appendNewline);

export const matchGoReg = () => {

    const editor: TextEditor = vscode.window.activeTextEditor!;
    const lineNumber: number = editor.selection.active.line;
    const line: TextLine = editor.document.lineAt(lineNumber);
    const lineText: string = line.text;
    const lastEditChar: string = lineText.substr(-1);

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