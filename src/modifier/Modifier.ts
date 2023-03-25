import { join } from "path";
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

	constructor(public cwd: string, public ts: boolean = false, ) { }

	/**
	 * Modifier callback
	 *
	 * @param {string} line
	 * @param {number} index
	 * @param {any} params
	 * @returns {string}
	 */
	run(line: string, index: number, ...params: Array<unknown>): string {
		return line;
	}

	/**
	 * Run modifier.
	 *
	 * @param {string} cwd
	 * @param {boolean} ts
	 * @param {any} params
	 * @returns {void}
	 */
	static make(cwd: string, ts: boolean = false, ...params: Array<unknown>): void {
		const modifier = (new this(cwd, ts));

		updateLine(modifier.filePath, (line: string, index: number) => modifier.run(line, index, ...params));
	}
}
