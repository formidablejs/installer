import { join } from "path";
import { Modifier } from "./Modifier";

export class SessionModifier extends Modifier {
	/**
	 * File to be modified.
	 *
	 * @var {string} file
	 */
	protected file: string = join('config', 'session.imba');

	/**
	 * Modifier callback
	 *
	 * @param {string} line
	 * @param {number} index
	 * @returns {string}
	 */
	run(line: string, index: number): string {
		if (line.trim() == "same_site: helpers.env 'SESSION_SAME_SITE', 'none'") {
			return "	same_site: helpers.env 'SESSION_SAME_SITE', 'lax'";
		}

		return line;
	}
}
