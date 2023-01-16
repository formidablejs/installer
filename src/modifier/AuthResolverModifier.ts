import { join } from "path";
import { Modifier } from "./Modifier";

export class AuthResolverModifier extends Modifier {
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
		if (line.trim().startsWith('import { AppServiceResolver }')) {
			return `${line}\nimport { AuthServiceResolver } from '../app/Resolvers/AuthServiceResolver'`;
		}

		if (line.trim() === `${this.ts ? '//' : '#'} Application Service Resolvers...`) {
			return `${line}\n		AuthServiceResolver${this.ts ? ',' : ''}`;
		}

		return line;
	}
}
