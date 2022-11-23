import { Onboard } from "./Onboard";

export class Language extends Onboard {
	/**
	 * The name of the onboarding question.
	 *
	 * @var {string}
	 */
	static type: string = 'language';

	/**
	 * The description of the onboarding question.
	 *
	 * @var {string}
	 */
	static description: string = 'Will you be using Imba or TypeScript?';

	/**
	 * The choices for the onboarding question.
	 *
	 * @var {string[]}
	 */
	static choices: Array<string | object> = [
		{ name: 'Imba', value: 'imba', },
		{ name: 'TypeScript', value: 'typescript', },
	]
}
