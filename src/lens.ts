import { Range, SnippetString, window, CodeLensProvider, TextDocument, CodeLens, Command } from 'vscode';

/**
 * Main entrypoint for CodeLens string.
 * Prompts for a line number as input.
 * Outputs a string at the specified number.
 */
export async function valuePrompter() {
    let lineNumStr = await window.showInputBox({
        prompt: 'Line Number',
    });
    
    let lineNum = lineNumStr ? +lineNumStr : 1;

    let insertionLocation = new Range(lineNum - 1, 0, lineNum - 1, 0);
    let snippet = new SnippetString('console.log($1);\n');

    if (window.activeTextEditor) {
        window.activeTextEditor.insertSnippet(snippet, insertionLocation);
    }
}

export class MyCodeLensProvider implements CodeLensProvider {
    async provideCodeLenses(document: TextDocument): Promise<CodeLens[]> {
        let topOfDocument = new Range(0, 0, 0, 0);
    
        // Calls the valuePrompter function when the title is clicked.
        let c: Command = {
            command: 'extension.valuePrompter',
            title: 'Select a pre-flight to get started',
        };

        // Also calls the valuePrompter. This is a test of unicode characters for use as control markers
        let c2: Command = {
            command: 'extension.valuePrompter',
            title: 'Action: (☐), (✅), (❌)'
        };
    
        let codeLens = new CodeLens(topOfDocument, c);
        let altCodeLens = new CodeLens(topOfDocument, c2);
    
        // Return all the codeLenses.
        return [codeLens, altCodeLens];
    }
  }