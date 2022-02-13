import { Onboard } from "./Onboard";

export class Scaffolding extends Onboard {
	/**
	 * The name of the onboarding question.
	 *
	 * @var {string}
	 */
	static type: String = 'scaffolding';

	/**
	 * The description of the onboarding question.
	 *
	 * @var {string}
	 */
	static description: String = 'What\'s your preferred scaffolding?';

	/**
	 * The choices for the onboarding question.
	 *
	 * @var {string[]|Object[]}
	 */
	static choices: Array<String | Object> = [
		{
			name: 'Blank Canvans',
			value: 'blank',
		},
		{
			name: 'Single-page Application',
			value: 'spa',
		}
	];
}
