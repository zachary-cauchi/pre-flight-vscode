import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import * as glob from 'glob';
import * as yaml from 'yaml';

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
export class PreFlightProvider implements vscode.TreeDataProvider<PreFlight> {

    // Handles dispatching of events to/from vscode.
    private _onDidChangeTreeData: vscode.EventEmitter<PreFlight | undefined> = new vscode.EventEmitter<PreFlight | undefined>();
    readonly onDidChangeTreeData: vscode.Event<PreFlight | undefined> = this._onDidChangeTreeData.event;

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
     * @param {PreFlight} element The pre-flight to return.
     * @returns {vscode.TreeItem}
     * @memberof PreFlightProvider
     */
    getTreeItem(element: PreFlight): vscode.TreeItem {
        return element;
    }

    /**
     * Populates the associated view with a returned array of PreFlight objects.
     *
     * @param {PreFlight} [element]
     * @returns {Thenable<PreFlight[]>}
     * @memberof PreFlightProvider
     */
    getChildren(element?: PreFlight): Thenable<PreFlight[]> {
        
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
                vscode.window.showInformationMessage('Workspace has no package.json');
                return Promise.resolve([]);
            }
        }

    }

    private getPreflights(preFlightsPath: string): PreFlight[] {
        if (this.pathExists(preFlightsPath)) {
            // const results = JSON.parse(fs.readFileSync(preFlightsPath, 'utf-8'));

            const toDep = (moduleName: string, version: string): PreFlight => {
                if (this.pathExists(path.join(this.workspaceRoot, 'node_modules', moduleName))) {
                    return new PreFlight(moduleName, version, vscode.TreeItemCollapsibleState.Collapsed);
                } else {
                    return new PreFlight(moduleName, version, vscode.TreeItemCollapsibleState.None, {
                        command: 'extension.openPackageOnNpm',
                        title: '',
                        arguments: [moduleName]
                    });
                }
            };

            let contents = []
            let scriptPaths = glob.sync('**/*.yml', { cwd: preFlightsPath, absolute: true }, ).forEach((scriptPath) => {
                let script : Buffer = fs.readFileSync(scriptPath);
                let preflight : PreFlight = yaml.parse(script.toString());
                contents.push(script);
            });

            // const scripts = results.dependencies
            //     ? Object.keys(results.dependencies).map(dep => toDep(dep, results.dependencies[dep]))
            //     : [];
            // const devDeps = results.devDependencies
            //     ? Object.keys(results.devDependencies).map(dep => toDep(dep, results.devDependencies[dep]))
            //     : [];
            // return deps.concat(devDeps);
            return [];
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
export class PreFlight extends vscode.TreeItem {

    /**
     * Creates an instance of PreFlight.
     * @param {string} label The name of the pre-flight.
     * @param {string} body The contents of the pre-flight.
     * @param {vscode.TreeItemCollapsibleState} collapsibleState
     * @param {vscode.Command} [command]
     * @memberof PreFlight
     */
    constructor(
        public label: string,
        public body: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public readonly command?: vscode.Command
    ) {
        super(label, collapsibleState);
    }

    get tooltip(): string {
        return `${this.label} => ${this.body}`;
    }

    get description(): string {
        return `Testing item under name ${this.label}`;
    }

    contextValue = 'pre-flight';

}
