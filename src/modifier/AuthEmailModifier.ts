import { join } from "path";
import { Modifier } from "./Modifier";

export class AuthEmailModifier extends Modifier {
	/**
	 * File to be modified.
	 *
	 * @var {string} file
	 */
	protected file: string = join('app', 'Resolvers', 'AppServiceResolver.imba');

	/**
	 * Modifier callback
	 *
	 * @param {string} line
	 * @param {number} index
	 * @returns {string}
	 */
	run(line: string, index: number): string {
		return line.replace(/\#\s/g, '');;
	}
}
