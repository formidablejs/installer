import { join } from "path";
import { Modifier } from "./Modifier";

export class InertiaResolverModifier extends Modifier {
	/**
	 * File to be modified.
	 *
	 * @var {string} file
	 */
	protected file: string = join('config', 'app.imba');

	/**
	 * Modifier callback
	 *
	 * @param {string} line
	 * @param {number} index
	 * @returns {string}
	 */
	run(line: string, index: number): string {
		if (line.trim().startsWith('import { ValidationServiceResolver }')) {
			return `${line}\nimport { InertiaServiceResolver } from '@formidablejs/inertia'`
		}

		if (line.trim() == 'MaintenanceServiceResolver') {
			return `${line}\n		InertiaServiceResolver`
		}

		return line;
	}
}
