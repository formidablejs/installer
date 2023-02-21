import { Onboard } from "./Onboard";

export class Type extends Onboard {
	/**
	 * The name of the onboarding question.
	 *
	 * @var {string}
	 */
	static type: string = 'type';

	/**
	 * The default value.
	 *
	 * @var {string}
	 */
	static default?: string = 'full-stack';

	/**
	 * The description of the onboarding question.
	 *
	 * @var {string}
	 */
	static description: string = 'What type of application do you want to create?';

	/**
	 * The choices for the onboarding question.
	 *
	 * @var {string[]|object[]}
	 */
	static choices: Array<string | object> = [
		{
			name: 'API Application',
			value: 'api',
		},
		{
			name: 'Full-stack Application',
			value: 'full-stack',
		}
	];
}
