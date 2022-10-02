import { join } from "path";
import { Modifier } from "./Modifier";

export class PrettyErrorsModifier extends Modifier {
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
		if (line.trim().startsWith('import { ValidationServiceResolver }')) {
			return `${line}\nimport { PrettyErrorsServiceResolver } from '@formidablejs/pretty-errors'`;
		}

		if (line.trim() === `MaintenanceServiceResolver${this.ts ? ',' : ''}`) {
			return `${line}\n		PrettyErrorsServiceResolver${this.ts ? ',' : ''}`;
		}

		return line;
	}
}
