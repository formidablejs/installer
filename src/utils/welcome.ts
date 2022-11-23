import { color } from '@oclif/color';
const gradient = require('gradient-string');
var figlet = require('figlet');

/**
 * Display a welcome message
 *
 * @param {string} message The message to display
 * @returns {void}
 */
export const welcome = (message: string) => {
	console.log(gradient('cyan', 'magenta').multiline(figlet.textSync(message)))
	console.log(color.blueBright(' The one person framework ✌️ \n'));
}
