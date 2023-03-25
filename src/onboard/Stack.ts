import { dim } from '../utils/dim';
import { Onboard } from "./Onboard";

export class Stack extends Onboard {
	/**
	 * The name of the onboarding question.
	 *
	 * @var {string}
	 */
	static type: string = 'stack';

	/**
	 * The description of the onboarding question.
	 *
	 * @var {string}
	 */
	static description: string = 'What frontend stack do you want to use?';

	/**
	 * The choices for the onboarding question.
	 *
	 * @var {string[]|object[]}
	 */
	static choices: Array<string | object> = [
		{ name: 'Imba', value: 'imba' },
		{ name: 'React', value: 'react' },
		{ name: `Svelte ${dim('(experimental)')}`, value: 'svelte' },
		{ name: 'Vue', value: 'vue' },
	];
}
