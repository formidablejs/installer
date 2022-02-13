var inquirer = require('inquirer');

export class Onboard {
	/**
	 * The name of the onboarding question.
	 *
	 * @var {string}
	 */
	static type: String;

	/**
	 * The description of the onboarding question.
	 *
	 * @var {string}
	 */
	static description: String;

	/**
	 * The choices for the onboarding question.
	 *
	 * @var {string[]|Object[]}
	 */
	static choices: Array<String | Object>;

	/**
	 * Make prompt.
	 *
	 * @returns {Promise<void>}
	 */
	static async make() {
		return await inquirer.prompt([{
			name: this.type,
			message: this.description,
			type: 'list',
			choices: this.choices,
		}]);
	}
}
