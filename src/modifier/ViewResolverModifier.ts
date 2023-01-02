import { join } from "path";
import { Modifier } from "./Modifier";

export class ViewResolverModifier extends Modifier {
	/**
	 * File to be modified.
	 *
	 * @var {string} file
	 */
	protected file: string = join('config', 'app.imba');

	/**
	 * {@inheritdoc}
	 */
	public getFile(): string {
		return join('config', `app.${this.ts ? 'ts' : 'imba'}`);
	}

	/**
	 * Modifier callback
	 *
	 * @param {string} line
	 * @param {number} index
	 * @returns {string}
	 */
	run(line: string, index: number): string {
		if (line.trim().startsWith('import { TypeScriptPortsServiceResolver }')) {
			return `${line}\nimport { ViewServiceResolver } from '@formidablejs/view/lib/ViewServiceResolver'`;
		}

		if (line.trim() === `TypeScriptPortsServiceResolver${this.ts ? ',' : ''}`) {
			return `${line}\n		ViewServiceResolver${this.ts ? ',' : ''}`;
		}

		return line;
	}
}
