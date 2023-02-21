import { Onboard } from "./Onboard";

export class Scaffolding extends Onboard {
	/**
	 * The name of the onboarding question.
	 *
	 * @var {string}
	 */
	static type: string = 'scaffolding';

	/**
	 * The default value.
	 *
	 * @var {string}
	 */
	static default?: string = 'spa';

	/**
	 * The description of the onboarding question.
	 *
	 * @var {string}
	 */
	static description: string = 'What\'s your preferred scaffolding?';

	/**
	 * The choices for the onboarding question.
	 *
	 * @var {string[]|Object[]}
	 */
	static choices: Array<string | object> = [
		{
			name: 'Multi-page Application',
			value: 'mpa',
		},
		{
			name: 'Single-page Application',
			value: 'spa',
		}
	];
}
