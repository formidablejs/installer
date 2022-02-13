export class Hook {
	/**
	 * Instantiate hook.
	 *
	 * @param {string} cwd
	 */
	constructor(protected cwd: string) { }

	/**
	 * Run hook.
	 *
	 * @returns {void}
	 */
	run(): void { }

	/**
	* Run publishable.
	*
	* @param {string} cwd
	* @returns {void}
	*/
	static make(cwd: string): void {
		(new this(cwd)).run();
	}
}
