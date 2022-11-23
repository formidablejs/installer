import { dim } from '../utils/dim';
import { Onboard } from "./Onboard";

export class SQLiteGitIgnore extends Onboard {
	/**
	 * The name of the onboarding question.
	 *
	 * @var {string}
	 */
	static type: string = 'sqliteGitIgnore';

	/**
	 * The question onboarding method.
	 *
	 * @var {string}
	 */
	static method: string = 'confirm';

	/**
	 * The description of the onboarding question.
	 *
	 * @var {string}
	 */
	static description: string = 'Do you want Git to ignore your SQLite database?' + dim(' (You can change this later)');
}
