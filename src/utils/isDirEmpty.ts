const fs = require('fs');

/**
 * Check if directory is empty
 *
 * @param {string} dirName
 * @returns {boolean}
 */
export const isDirEmpty = (dirName: string): Boolean => {
	return fs.promises.readdir(dirName).then((files: any) => files.length === 0);
}
