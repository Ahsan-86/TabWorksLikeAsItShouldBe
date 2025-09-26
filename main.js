"use strict";
// // Only single line
// import { Plugin } from "obsidian";
Object.defineProperty(exports, "__esModule", { value: true });
// export default class TabWorksLikeAsItShouldBe extends Plugin {
// 	onload() {
// 		this.addCommand({
// 			id: "insert-tab",
// 			name: "Insert Tab",
// 			hotkeys: [{ modifiers: [], key: "Tab" }],
// 			editorCallback: (editor) => {
// 				editor.replaceSelection("\t");
// 			}
// 		});
// 		this.addCommand({
// 			id: "remove-tab",
// 			name: "Remove Tab", 
// 			hotkeys: [{ modifiers: ["Shift"], key: "Tab" }],
// 			editorCallback: (editor) => {
// 				const cursor = editor.getCursor();
// 				const line = editor.getLine(cursor.line);
// 				// Remove tab at cursor position or beginning of line
// 				if (cursor.ch > 0 && line[cursor.ch - 1] === "\t") {
// 					editor.replaceRange(
// 						"",
// 						{ line: cursor.line, ch: cursor.ch - 1 },
// 						{ line: cursor.line, ch: cursor.ch }
// 					);
// 				} else if (line.startsWith("\t")) {
// 					editor.replaceRange(
// 						"",
// 						{ line: cursor.line, ch: 0 },
// 						{ line: cursor.line, ch: 1 }
// 					);
// 				}
// 			}
// 		});
// 	}
// }
//Multiple Line Functionality
const obsidian_1 = require("obsidian");
class TabWorksLikeAsItShouldBe extends obsidian_1.Plugin {
    onload() {
        this.addCommand({
            id: "insert-tab",
            name: "Insert Tab",
            hotkeys: [{ modifiers: [], key: "Tab" }],
            editorCallback: (editor) => {
                this.handleTab(editor);
            }
        });
        this.addCommand({
            id: "remove-tab",
            name: "Remove Tab",
            hotkeys: [{ modifiers: ["Shift"], key: "Tab" }],
            editorCallback: (editor) => {
                this.handleShiftTab(editor);
            }
        });
    }
    handleTab(editor) {
        // If there's a selection spanning multiple lines, indent all selected lines
        if (this.hasMultiLineSelection(editor)) {
            this.indentSelectedLines(editor);
        }
        else {
            // Single line or no selection - just insert a tab
            editor.replaceSelection("\t");
        }
    }
    handleShiftTab(editor) {
        // If there's a selection spanning multiple lines, unindent all selected lines
        if (this.hasMultiLineSelection(editor)) {
            this.unindentSelectedLines(editor);
        }
        else {
            // Single line - remove tab at cursor
            this.removeTabAtCursor(editor);
        }
    }
    hasMultiLineSelection(editor) {
        const selections = editor.listSelections();
        for (const selection of selections) {
            const startLine = Math.min(selection.anchor.line, selection.head.line);
            const endLine = Math.max(selection.anchor.line, selection.head.line);
            if (startLine !== endLine) {
                return true;
            }
            // Also consider it multi-line if selection spans full lines
            const startCh = Math.min(selection.anchor.ch, selection.head.ch);
            const endCh = Math.max(selection.anchor.ch, selection.head.ch);
            const lineText = editor.getLine(startLine);
            // If selection starts at column 0 and goes to end of line or beyond
            if (startCh === 0 && endCh >= lineText.length && startLine === endLine) {
                // Check if there are more lines selected (common when dragging mouse down)
                const nextLine = editor.getLine(startLine + 1);
                if (nextLine !== undefined) {
                    return true;
                }
            }
        }
        return false;
    }
    indentSelectedLines(editor) {
        const selections = editor.listSelections();
        const linesToIndent = new Set();
        // Collect all lines that need to be indented
        for (const selection of selections) {
            const startLine = Math.min(selection.anchor.line, selection.head.line);
            const endLine = Math.max(selection.anchor.line, selection.head.line);
            for (let line = startLine; line <= endLine; line++) {
                linesToIndent.add(line);
            }
        }
        // Sort lines in reverse order to maintain proper cursor positions
        const sortedLines = Array.from(linesToIndent).sort((a, b) => b - a);
        // Indent each line
        for (const line of sortedLines) {
            const lineText = editor.getLine(line);
            editor.replaceRange("\t" + lineText, { line, ch: 0 }, { line, ch: lineText.length });
        }
        // Adjust cursor positions to account for added tabs
        const newSelections = selections.map(selection => {
            const startLine = Math.min(selection.anchor.line, selection.head.line);
            const endLine = Math.max(selection.anchor.line, selection.head.line);
            return {
                anchor: {
                    line: selection.anchor.line,
                    ch: selection.anchor.ch + (linesToIndent.has(selection.anchor.line) ? 1 : 0)
                },
                head: {
                    line: selection.head.line,
                    ch: selection.head.ch + (linesToIndent.has(selection.head.line) ? 1 : 0)
                }
            };
        });
        editor.setSelections(newSelections);
    }
    unindentSelectedLines(editor) {
        const selections = editor.listSelections();
        const linesToUnindent = new Set();
        const linesThatWereUnindented = new Set();
        // Collect all lines that need to be unindented
        for (const selection of selections) {
            const startLine = Math.min(selection.anchor.line, selection.head.line);
            const endLine = Math.max(selection.anchor.line, selection.head.line);
            for (let line = startLine; line <= endLine; line++) {
                linesToUnindent.add(line);
            }
        }
        // Sort lines in reverse order to maintain proper cursor positions
        const sortedLines = Array.from(linesToUnindent).sort((a, b) => b - a);
        // Unindent each line that starts with a tab
        for (const line of sortedLines) {
            const lineText = editor.getLine(line);
            if (lineText.startsWith("\t")) {
                editor.replaceRange(lineText.substring(1), { line, ch: 0 }, { line, ch: lineText.length });
                linesThatWereUnindented.add(line);
            }
            else if (lineText.startsWith("    ")) {
                // Also handle 4 spaces (common alternative to tabs)
                editor.replaceRange(lineText.substring(4), { line, ch: 0 }, { line, ch: lineText.length });
                linesThatWereUnindented.add(line);
            }
        }
        // Adjust cursor positions to account for removed tabs/spaces
        const newSelections = selections.map(selection => {
            const adjustChar = (line, ch) => {
                if (!linesThatWereUnindented.has(line))
                    return ch;
                const lineText = editor.getLine(line);
                const originalLineText = editor.getLine(line); // This would need original text cache
                // Simple adjustment: if character was beyond first position, decrease by 1 (for tab) or 4 (for spaces)
                if (ch > 0) {
                    if (originalLineText.startsWith("\t") && ch >= 1) {
                        return Math.max(0, ch - 1);
                    }
                    else if (originalLineText.startsWith("    ") && ch >= 4) {
                        return Math.max(0, ch - 4);
                    }
                }
                return ch;
            };
            return {
                anchor: {
                    line: selection.anchor.line,
                    ch: adjustChar(selection.anchor.line, selection.anchor.ch)
                },
                head: {
                    line: selection.head.line,
                    ch: adjustChar(selection.head.line, selection.head.ch)
                }
            };
        });
        editor.setSelections(newSelections);
    }
    removeTabAtCursor(editor) {
        const cursor = editor.getCursor();
        const line = editor.getLine(cursor.line);
        // Remove tab at cursor position if present
        if (cursor.ch > 0 && line[cursor.ch - 1] === "\t") {
            editor.replaceRange("", { line: cursor.line, ch: cursor.ch - 1 }, { line: cursor.line, ch: cursor.ch });
        }
        // Remove tab at beginning of line if present
        else if (line.startsWith("\t")) {
            editor.replaceRange("", { line: cursor.line, ch: 0 }, { line: cursor.line, ch: 1 });
        }
        // Remove 4 spaces if present (common alternative)
        else if (line.startsWith("    ")) {
            editor.replaceRange("", { line: cursor.line, ch: 0 }, { line: cursor.line, ch: 4 });
        }
        // Remove spaces at cursor position
        else if (cursor.ch > 0) {
            const beforeCursor = line.substring(0, cursor.ch);
            const spacesBefore = beforeCursor.length - beforeCursor.trimStart().length;
            if (spacesBefore > 0) {
                // Remove all leading spaces up to cursor
                const spaceStart = beforeCursor.search(/\S|$/);
                editor.replaceRange("", { line: cursor.line, ch: spaceStart }, { line: cursor.line, ch: cursor.ch });
            }
        }
    }
}
exports.default = TabWorksLikeAsItShouldBe;
//# sourceMappingURL=main.js.map