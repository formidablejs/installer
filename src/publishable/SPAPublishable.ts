import { Publishable } from "./Publishable";

export class SPAPublishable extends Publishable {
	/**
	 * Package to publish.
	 *
	 * @var {string} package
	 */
	protected package: string = '@formidablejs/view';

	/**
	 * Tags to publish.
	 *
	 * @var {string[]} package
	 */
	protected tags: string[] = ['vendor'];
}
