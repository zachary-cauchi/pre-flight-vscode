import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

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
			vscode.window.showInformationMessage('No dependency in empty workspace');
			return Promise.resolve([]);
		}

		if (element && element.label) {
			return Promise.resolve(this.getDepsInPackageJson(path.join(this.workspaceRoot, 'node_modules', element.label, 'package.json')));
		} else {
			const packageJsonPath = path.join(this.workspaceRoot, 'package.json');
			if (this.pathExists(packageJsonPath)) {
				return Promise.resolve(this.getDepsInPackageJson(packageJsonPath));
			} else {
				vscode.window.showInformationMessage('Workspace has no package.json');
				return Promise.resolve([]);
			}
		}

    }

    private getDepsInPackageJson(packageJsonPath: string): PreFlight[] {
		if (this.pathExists(packageJsonPath)) {
			const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

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

			const deps = packageJson.dependencies
				? Object.keys(packageJson.dependencies).map(dep => toDep(dep, packageJson.dependencies[dep]))
				: [];
			const devDeps = packageJson.devDependencies
				? Object.keys(packageJson.devDependencies).map(dep => toDep(dep, packageJson.devDependencies[dep]))
				: [];
			return deps.concat(devDeps);
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
     * @param {string} name The name of the pre-flight.
     * @param {string} body The contents of the pre-flight.
     * @param {vscode.TreeItemCollapsibleState} collapsibleState
     * @param {vscode.Command} [command]
     * @memberof PreFlight
     */
    constructor(
        public name: string,
        public body: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public readonly command?: vscode.Command
    ) {
        super(name, collapsibleState);
    }

    get tooltip(): string {
        return `${this.name} => ${this.body}`;
    }

    get description(): string {
        return `Testing item under name ${this.name}`;
    }

    contextValue = 'pre-flight';

}
