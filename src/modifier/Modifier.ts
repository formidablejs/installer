import { join } from "path";
import { IOnboarding } from "../interface";
import { updateLine } from "../utils/updateLine";

export class Modifier {
	/**
	 * File to be modified.
	 *
	 * @var {string} file
	 */
	protected file: string = '';

	/**
	 * Get file.
	 *
	 * @returns {string}
	 */
	public getFile(): string {
		return this.file;
	}

	/**
	 * Get file path
	 */
	public get filePath(): string {
		return join(this.cwd, this.getFile());
	}

	constructor(public cwd: string, public ts: Boolean = false) { }

	/**
	 * Modifier callback
	 *
	 * @param {string} line
	 * @param {number} index
	 * @returns {string}
	 */
	run(line: string, index: number): string {
		return line;
	}

	/**
	 * Run modifier.
	 *
	 * @param {string} cwd
	 * @returns {void}
	 */
	static make(cwd: string, ts: Boolean = false): void {
		const modifier = (new this(cwd, ts));

		updateLine(modifier.filePath, (line: string, index: number) => modifier.run(line, index));
	}
}
