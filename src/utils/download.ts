import { createWriteStream } from 'fs';
import { resolve } from 'path';
import axios, { AxiosResponse } from 'axios';

/**
 * Download file
 *
 * @param {string} fileUrl github branch zip url
 * @param {string} outputLocation output path
 * @returns
 */
export const download = (fileUrl: string, outputLocation: any) => {
	const writer = createWriteStream(outputLocation);

	return axios({
		method: 'get',
		url: fileUrl,
		responseType: 'stream',
	}).then((response: AxiosResponse) => {
		return new Promise((resolve, reject) => {
			response.data.pipe(writer);

			let error: any = null;

			writer.on('error', (err) => {
				error = err;
				writer.close();
				reject(err);
			});

			writer.on('close', () => {
				if (!error) {
					resolve(true);
				}
			});
		});
	}).catch((error) => {
		//
	});
}
