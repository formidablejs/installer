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
	 * {@inheritdoc}
	 */
	public getFile(): string {
		return join('app', 'Resolvers', `AppServiceResolver.${this.ts ? 'ts' : 'imba'}`);
	}

	/**
	 * Modifier callback
	 *
	 * @param {string} line
	 * @param {number} index
	 * @returns {string}
	 */
	run(line: string, index: number): string {
		return this.ts ? line.replace(/\/\/\s/g, '') : line.replace(/\#\s/g, '');
	}
}
