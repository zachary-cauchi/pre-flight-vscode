import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import * as glob from 'glob';
import * as yaml from 'yaml';
import { PreFlightFactory, IPreFlight, PreFlight } from '../models/pre-flight';

/**
 * PreFlight View Provider for view 'pre-flights-explorer'.
 * 
 * Currently, does not function, serving only as a base from which actual logic will be added.
 * 
 * Taken from the vscode-extension-samples repository.
 * @see https://github.com/microsoft/vscode-extension-samples/blob/master/tree-view-sample/src/nodeDependencies.ts
 *
 * @export
 * @class PreFlightProvider
 * @implements {vscode.TreeDataProvider<PreFlight>}
 */
export class PreFlightProvider implements vscode.TreeDataProvider<PreFlightTreeItem> {

    // Handles dispatching of events to/from vscode.
    private _onDidChangeTreeData: vscode.EventEmitter<PreFlightTreeItem | undefined> = new vscode.EventEmitter<PreFlightTreeItem | undefined>();
    readonly onDidChangeTreeData: vscode.Event<PreFlightTreeItem | undefined> = this._onDidChangeTreeData.event;

    private preFlightFactory = new PreFlightFactory();

    constructor(private workspaceRoot: string) {
    }

    /**
     * Refreshes the associated view on when fired.
     *
     * @memberof PreFlightProvider
     */
    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    /**
     * Returns the provided PreFlight.
     *
     * @param {PreFlightTreeItem} element The pre-flight to return.
     * @returns {vscode.TreeItem}
     * @memberof PreFlightProvider
     */
    getTreeItem(element: PreFlightTreeItem): vscode.TreeItem {
        return element;
    }

    /**
     * Populates the associated view with a returned array of PreFlight objects.
     *
     * @param {PreFlightTreeItem} [element]
     * @returns {Thenable<PreFlightTreeItem[]>}
     * @memberof PreFlightProvider
     */
    getChildren(element?: PreFlightTreeItem): Thenable<PreFlightTreeItem[]> {
        
        if (!this.workspaceRoot) {
            vscode.window.showInformationMessage('A workspace isn\'t open. Cannot populate');
            return Promise.resolve([]);
        }


        if (element && element.label) {
            vscode.window.showInformationMessage('No children can be displayed at this time');
            return Promise.resolve([]);
        } else {
            const packageJsonPath = path.join(this.workspaceRoot, 'pre-flights');

            if (this.pathExists(packageJsonPath)) {
                return Promise.resolve(this.getPreflights(packageJsonPath));
            } else {
                vscode.window.showInformationMessage('Workspace has no pre-flights directory');
                return Promise.resolve([]);
            }
        }

    }

    private getPreflights(preFlightsPath: string): PreFlightTreeItem[] {
        if (this.pathExists(preFlightsPath)) {

            let contents : PreFlightTreeItem[] = [];
            let scriptPaths = glob.sync('**/*.yml', { cwd: preFlightsPath, absolute: true }, ).forEach((scriptPath) => {
                let fileRaw : Buffer = fs.readFileSync(scriptPath);
                let fileParsed : IPreFlight = yaml.parse(fileRaw.toString());

                let preflight : PreFlight = this.preFlightFactory.createPreFlight(fileParsed);

                contents.push(PreFlightTreeItem.fromPreFlight(preflight, vscode.TreeItemCollapsibleState.None));
            });

            return contents;
        } else {
            return [];
        }
    }

    private pathExists(p: string): boolean {
        try {
            fs.accessSync(p);
        } catch (err) {
            return false;
        }

        return true;
    }

}

/**
 * A View model for pre-flights.
 *
 * @export
 * @class PreFlight
 * @extends {vscode.TreeItem}
 */
export class PreFlightTreeItem extends vscode.TreeItem {

    /**
     * Creates an instance of PreFlight.
     * @param {string} label The name of the pre-flight.
     * @param {string} body The contents of the pre-flight.
     * @param {vscode.TreeItemCollapsibleState} collapsibleState
     * @param {vscode.Command} [command]
     * @memberof PreFlight
     */
    constructor(
        public preflight: PreFlight,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public readonly command?: vscode.Command
    ) {
        super(preflight.name, collapsibleState);
        this.contextValue = 'pre-flight';
    }

    get tooltip(): string {
        return `${this.label} => ${this.preflight.version}`;
    }

    get description(): string {
        return `Testing item under name ${this.label}`;
    }

    static fromPreFlight(preflight : PreFlight, collapsibleState : vscode.TreeItemCollapsibleState) : PreFlightTreeItem {
        return new PreFlightTreeItem(preflight, collapsibleState);
    }

}
