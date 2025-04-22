import { color } from '@oclif/color';
import { execSync } from "child_process";
import New from '../commands/new';

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
	publish(verbose?: boolean, runtime?: string): void {
		if (verbose) {
			console.log(color.green('Tagging') + ` ${this.package}:` + color.green(`${this.tags.join(',')}`));
		}

		execSync(`${runtime ?? 'node'} craftsman package:publish --package=${this.package} --tag=${this.tags.join(',')} --force`, {
			cwd: this.cwd, stdio: verbose ? 'inherit' : 'ignore'
		});
	}

	/**
	 * Run publishable.
	 *
	 * @param {string} cwd
	 * @param {string[]} customTags
	 * @returns {void}
	 */
	static make(cwd: string, extraTags?: string[], command?: New): void {
		const publishable = new this(cwd);

		if (extraTags) {
			publishable.tags = publishable.tags.concat(extraTags)
		}

		publishable.publish(
			command?.verbose ?? false,
			command?.onboarding.manager == 'bun' ? 'bun' : 'node'
		);
	}
}
