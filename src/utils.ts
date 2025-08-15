import axios from 'axios';
import z, { ZodError } from 'zod';

export function handleError(error: unknown): string {
	let message: string;
	if (error instanceof Error) {
		message = error.message;
	} else if (error && typeof error === 'object' && 'message' in error) {
		message = String(error.message);
	} else if (typeof error === 'string') {
		message = error;
	} else {
		message = 'Something went wrong';
	}
	return message;
}

export function handleAxiosError(error: unknown) {
	if (axios.isAxiosError(error)) {
		let message = error.response?.data?.error || 'Something went wrong, please try again later.';
		throw new Error(message);
	} else {
		throw new Error('Something went wrong, please try again later.');
	}
}

export async function delay(time: number) {
	await new Promise((resolve) => setTimeout(resolve, time));
}

export function handleZodError<T>(error: ZodError<T>) {
	let flattenedError = z.flattenError(error);
	return flattenedError.fieldErrors;
}

export function isJSON(text: string) {
	try {
		JSON.parse(text);
	} catch {
		return false;
	}
	return true;
}
