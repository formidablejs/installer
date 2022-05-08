import { dim } from '../utils/dim';
import { Onboard } from "./Onboard";

export class SQLiteGitIgnore extends Onboard {
	/**
	 * The name of the onboarding question.
	 *
	 * @var {string}
	 */
	static type: String = 'sqliteGitIgnore';

	/**
	 * The question onboarding method.
	 *
	 * @var {string}
	 */
	static method: String = 'confirm';

	/**
	 * The description of the onboarding question.
	 *
	 * @var {string}
	 */
	static description: String = 'Do you want Git to ignore your SQLite database?' + dim(' (You can change this later)');
}
