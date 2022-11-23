import { IPrompt } from "../interface";

var inquirer = require('inquirer');

export class Onboard {
	/**
	 * The name of the onboarding question.
	 *
	 * @var {string}
	 */
	static type: string;

	/**
	 * The question onboarding method.
	 *
	 * @var {string}
	 */
	static method: string = 'list';

	/**
	 * The description of the onboarding question.
	 *
	 * @var {string}
	 */
	static description: string;

	/**
	 * The choices for the onboarding question.
	 *
	 * @var {string[]|object[]}
	 */
	static choices: Array<string | object>;

	/**
	 * Make prompt.
	 *
	 * @returns {Promise<void>}
	 */
	static async make() {
		const prompt: IPrompt = {
			name: this.type,
			type: this.method,
			message: this.description,
		};

		if (this.method === 'list') {
			prompt.choices = this.choices;
		}

		return await inquirer.prompt([prompt]);
	}
}
