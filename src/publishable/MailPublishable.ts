import { Publishable } from "./Publishable";

export class MailPublishable extends Publishable {
	/**
	 * Package to publish.
	 *
	 * @var {string} package
	 */
	protected package: string = '@formidablejs/mailer';

	/**
	 * Tags to publish.
	 *
	 * @var {string[]} package
	 */
	protected tags: string[] = ['components', 'config'];
}
