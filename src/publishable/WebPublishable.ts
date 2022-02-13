import { Publishable } from "./Publishable";

export class WebPublishable extends Publishable {
	/**
	 * Package to publish.
	 *
	 * @var {string} package
	 */
	protected package: string = '@formidablejs/framework';

	/**
	 * Tags to publish.
	 *
	 * @var {string[]} package
	 */
	protected tags: string[] = ['web'];
}
