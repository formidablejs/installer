import { Onboard } from "./Onboard";

export class Manager extends Onboard {
	/**
	 * The name of the onboarding question.
	 *
	 * @var {string}
	 */
	static type: String = 'manager';

	/**
	 * The description of the onboarding question.
	 *
	 * @var {string}
	 */
	static description: String = 'Which package manager do you want to use?';

	/**
	 * The choices for the onboarding question.
	 *
	 * @var {string[]}
	 */
	static choices: Array<String | Object> = ['npm', 'yarn', 'pnpm'];
}
