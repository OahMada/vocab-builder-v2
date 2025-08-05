import { handleAxiosError } from '@/utils';
import axios from 'axios';

export async function postFetcher<T>(url: string, { arg }: { arg: unknown }): Promise<T> {
	try {
		let response = await axios.post<T>(url, arg);
		return response.data;
	} catch (err) {
		throw handleAxiosError(err);
	}
}
