/* eslint-disable @typescript-eslint/no-explicit-any */
import 'server-only';

import axios from 'axios';
import { handleError } from '@/utils';

export default async function invoke(action: string, params: Record<string, any> = {}) {
	try {
		let response = await axios.post('http://127.0.0.1:8765', {
			action,
			version: 6,
			params,
		});

		let data = response.data;
		if (data.error) {
			throw new Error(data.error);
		}
		return data.result;
	} catch (error) {
		let errMsg = handleError(error);
		throw new Error(`AnkiConnect request failed: ${errMsg}`);
	}
}
