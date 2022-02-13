import { existsSync, readFileSync, writeFileSync } from "fs"

/**
 * Update line.
 *
 * @param {string} file
 * @param {Function} callback
 * @returns {boolean}
 */
export const updateLine = (file: string, callback: Function): Boolean => {
	if (!existsSync(file)) return false;

	const contents: string = readFileSync(file, 'utf8');
	const lines: string[] = [];

	contents.split('\n').map((line: string, index: number) => {
		lines.push(callback(line, index));
	});

	writeFileSync(file, lines.join('\n'), {
		encoding: 'utf8',
	});

	return true;
};
