import { color } from '@oclif/color';
import { spawnSync } from "child_process";

export class Publishable {
	/**
	 * Package to publish.
	 *
	 * @var {string} package
	 */
	protected package: string = '';

	/**
	 * Tags to publish.
	 *
	 * @var {string[]} package
	 */
	protected tags: string[] = [];

	/**
	 * Instantiate publishable.
	 *
	 * @param {string} cwd
	 */
	constructor(protected cwd: string) { }

	/**
	 * Publish package.
	 *
	 * @returns {void}
	 */
	publish(): void {
		console.log(color.green('tagging') + ` ${this.package}:` + color.green(`${this.tags.join(',')}`));

		spawnSync('./node_modules/.bin/craftsman', ['publish', '--package', this.package, '--tag', this.tags.join(','), '--force'], {
			cwd: this.cwd, stdio: 'inherit'
		});
	}

	/**
	 * Run publishable.
	 *
	 * @param {string} cwd
	 * @returns {void}
	 */
	static make(cwd: string): void {
		(new this(cwd)).publish();
	}
}
