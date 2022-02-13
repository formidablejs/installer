import { Onboard } from "./Onboard";

export class Type extends Onboard {
	/**
	 * The name of the onboarding question.
	 *
	 * @var {string}
	 */
	static type: String = 'type';

	/**
	 * The description of the onboarding question.
	 *
	 * @var {string}
	 */
	static description: String = 'What type of application do you want to create?';

	/**
	 * The choices for the onboarding question.
	 *
	 * @var {string[]|Object[]}
	 */
	static choices: Array<String | Object> = [
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
