import { color } from '@oclif/color';
import { execSync } from "child_process";
import { join } from 'path';

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
		console.log(color.green('Tagging') + ` ${this.package}:` + color.green(`${this.tags.join(',')}`));

		execSync(`node craftsman package:publish --package=${this.package} --tag=${this.tags.join(',')} --force`, {
			cwd: this.cwd, stdio: 'inherit'
		});
	}

	/**
	 * Run publishable.
	 *
	 * @param {string} cwd
	 * @param {string[]} customTags
	 * @returns {void}
	 */
	static make(cwd: string, extraTags?: string[]): void {
		const publishable = new this(cwd);

		if (extraTags) {
			publishable.tags = publishable.tags.concat(extraTags)
		}

		publishable.publish();
	}
}
