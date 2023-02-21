import { dim } from '../utils/dim';
import { Onboard } from "./Onboard";

export class Authentication extends Onboard {
	/**
	 * The name of the onboarding question.
	 *
	 * @var {string}
	 */
	static type: string = 'authentication';

	/**
	 * The question onboarding method.
	 *
	 * @var {string}
	 */
	static method: string = 'confirm';

	/**
	 * The description of the onboarding question.
	 *
	 * @var {string}
	 */
	static description: string = 'Do you want your application to be Auth ready?';
}
