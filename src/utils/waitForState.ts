/**
 * Wait for busy state to change.
 *
 * @param {Function} condition
 * @returns {Promise<void>}
 */
export const waitForState = async (condition: Function): Promise<void> => {
	const poll = (resolve: any) => {
		if (condition()) {
			resolve();
		} else {
			setTimeout(_ => poll(resolve), 400)
		}
	}

	return new Promise(poll)
}
