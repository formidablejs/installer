import { Publishable } from "./Publishable";

export class InertiaPublishable extends Publishable {
	/**
	 * Package to publish.
	 *
	 * @var {string} package
	 */
	protected package: string = '@formidablejs/inertia';

	/**
	 * Tags to publish.
	 *
	 * @var {string[]} package
	 */
	protected tags: string[] = ['vendor'];
}
