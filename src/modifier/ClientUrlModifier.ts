import { Modifier } from "./Modifier";

export class ClientUrlModifier extends Modifier {
	/**
	 * File to be modified.
	 *
	 * @var {string} file
	 */
	protected file: string = '.env';

	/**
	 * Modifier callback
	 *
	 * @param {string} line
	 * @param {number} index
	 * @returns {string}
	 */
	run(line: string, index: number): string {
		if (line.trim() === 'CLIENT_URL=http://localhost:8000') {
			return '# CLIENT_URL=http://localhost:8000';
		}

		return line;
	}
}
