import { existsSync, readFileSync } from "fs"

/**
 * Get line.
 *
 * @param {string} file
 * @param {number} index
 * @returns {string|null}
 */
export const getLine = (file: string, index: number): string | null => {
	if (existsSync(file)) {
		throw new Error(`File ${file} does not exist`);
	}

	const contents = readFileSync(file, 'utf8');

	for (let i: number = 0; i < contents.split('\n').length; i++) {
		if (i === index) {
			return contents.split('\n')[i];
		}
	}

	return null;
};
