import { join } from "path";
import { Modifier } from "./Modifier";

export class InertiaConfigModifier extends Modifier {
	/**
	 * File to be modified.
	 *
	 * @var {string} file
	 */
	protected file: string = join('config', 'index.imba');

	/**
	 * {@inheritdoc}
	 */
	public getFile(): string {
		return join('config', `index.${this.ts ? 'ts' : 'imba'}`);
	}

	/**
	 * Modifier callback
	 *
	 * @param {string} line
	 * @param {number} index
	 * @returns {string}
	 */
	run(line: string, index: number): string {
		if (line.trim().startsWith('import hashing')) {
			return `${line}\nimport inertia from './inertia'`;
		}

		if (line.trim() == `hashing${this.ts ? ',' : ''}`) {
			return `${line}\n			inertia${this.ts ? ',' : ''}`;
		}

		return line;
	}
}
