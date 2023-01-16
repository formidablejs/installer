import { Onboard } from "./Onboard";

export class Scaffolding extends Onboard {
	/**
	 * The name of the onboarding question.
	 *
	 * @var {string}
	 */
	static type: string = 'scaffolding';

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
			name: 'Multi-page Application (with Auth template)',
			value: 'mpa-auth',
		},
		{
			name: 'Single-page Application',
			value: 'spa',
		},
		{
			name: 'Single-page Application (with Auth template)',
			value: 'spa-auth',
		}
	];
}
