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
		if (line.trim().startsWith('CLIENT_URL=')) {
			return `# ${line.trim()}`;
		}

		return line;
	}
}
