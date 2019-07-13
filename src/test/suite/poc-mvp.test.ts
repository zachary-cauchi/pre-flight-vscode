import * as vscode from 'vscode';
import { before } from 'mocha';

import 'vscode-test';
import 'chai';

suite('Minimum Viable Product revision 1 tests', () => {
	before(() => {
		vscode.window.showInformationMessage('Pre-Flight fundamentals tests.');
	});

    test('The extension should be active');
    suite('Line prompts', () => {
        test('There should be a prompt above line 5');
        test('Clicking on the prompt should append a string to the end');
    });
    suite('Config files', () => {
        test('There should be a json config file with properties "specRev" and "name"');
        test('The config file should control the behaviour of the line prompt');
    });
});
