import { Onboard } from "./Onboard";

export class Manager extends Onboard {
	/**
	 * The name of the onboarding question.
	 *
	 * @var {string}
	 */
	static type: string = 'manager';

	/**
	 * The description of the onboarding question.
	 *
	 * @var {string}
	 */
	static description: string = 'Which package manager do you want to use?';

	/**
	 * The choices for the onboarding question.
	 *
	 * @var {string[]}
	 */
	static choices: Array<string | object> = [
		{ name: 'npm', value: 'npm', },
		{ name: 'pnpm', value: 'pnpm', },
		{ name: 'yarn', value: 'yarn', },
		{ name: 'bun', value: 'bun', },
	]
}
