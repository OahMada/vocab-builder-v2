import axios from 'axios';

import { handleAxiosError } from '@/utils';

export async function postFetcher<T, ArgT>(url: string, { arg }: { arg: ArgT }): Promise<T> {
	try {
		let response = await axios.post<T>(url, arg);
		return response.data;
	} catch (err) {
		throw handleAxiosError(err);
	}
}
