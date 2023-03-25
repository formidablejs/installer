import { join } from "path";
import { Modifier } from "./Modifier";

export class WatchScriptModifier extends Modifier {
	/**
	 * File to be modified.
	 *
	 * @var {string} file
	 */
	protected file: string = join('config', 'inertia.imba');

	/**
	 * {@inheritdoc}
	 */
	public getFile(): string {
		return join('config', `inertia.${this.ts ? 'ts' : 'imba'}`);
	}

	/**
	 * Modifier callback
	 *
	 * @param {string} line
	 * @param {number} index
	 * @param {string} manager
	 * @returns {string}
	 */
	run(line: string, index: number, manager: string): string {
		if (line.trim() == 'mix: "npm run mix:watch"') {
			return `	mix: "${manager == 'pnpm' ? 'pnpm run' : manager} mix:watch"`;
		}

		return line;
	}
}
