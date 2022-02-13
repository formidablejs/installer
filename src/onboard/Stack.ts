import { Onboard } from "./Onboard";

export class Stack extends Onboard {
	/**
	 * The name of the onboarding question.
	 *
	 * @var {string}
	 */
	static type: String = 'stack';

	/**
	 * The description of the onboarding question.
	 *
	 * @var {string}
	 */
	static description: String = 'Which stack do you want to use?';

	/**
	 * The choices for the onboarding question.
	 *
	 * @var {string[]|Object[]}
	 */
	static choices: Array<String | Object> = [
		{ name: 'Imba', value: 'imba' },
		{ name: 'React', value: 'react' },
		{ name: 'Vue', value: 'vue' },
	];
}
