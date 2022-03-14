import { color } from '@oclif/color';

export const dim = (s: string): string => {
	try {
		return color.dim(s);
	} catch (e) {
		return `\x1b[2m${s}\x1b[2m`;
	}
}
