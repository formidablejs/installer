import { color } from '@oclif/color';
var figlet = require('figlet');

/**
 * Display a welcome message
 *
 * @param {string} message The message to display
 * @returns {void}
 */
export const welcome = (message: string) => {
	console.log(color.blueBright(
		figlet.textSync(message) + '\n' +
		' The one person framework ✌️ \n'
	));
}
