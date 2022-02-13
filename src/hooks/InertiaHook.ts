import { existsSync, readFileSync, rmSync, writeFileSync } from "fs";
import { copySync } from "fs-extra";
import { join } from "path";
import { Hook } from "./Hook";

export class InertiaHook extends Hook {
	/**
	 * Preset name.
	 *
	 * @var {string} file
	 */
	protected preset: string = '';

	/**
	 * Run hook.
	 *
	 * @returns {void}
	 */
	run(): void {
		/** load files. */
		const presetPath = join(this.cwd, 'node_modules', '@formidablejs/inertia', 'formidable', 'presets', this.preset, 'preset.json');
		const preset = JSON.parse(readFileSync(presetPath).toString());
		const presetFiles = join(this.cwd, 'node_modules', '@formidablejs/inertia', 'formidable', 'presets', this.preset, preset.files)

		/** copy preset files to application. */
		copySync(presetFiles, this.cwd);

		/** read package.json file. */
		const packageName = join(this.cwd, 'package.json');
		const packageObject = JSON.parse(readFileSync(packageName).toString());

		/** update deps. */
		packageObject.scripts = Object.assign(packageObject.scripts, preset.npm.scripts);
		packageObject.devDependencies = Object.assign(packageObject.devDependencies, preset.npm.devDependencies);

		writeFileSync(packageName, JSON.stringify(packageObject, null, 2));

		/** remove welcome.imba file */
		const welcomeImba = join(this.cwd, 'resources', 'views', 'welcome.imba');

		if (existsSync(welcomeImba)) {
			rmSync(welcomeImba);
		}
	}
}
