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

export function handleZodError<T>(error: ZodError<T>, mode: 'prettify'): string;
export function handleZodError<T>(error: ZodError<T>, mode?: 'flatten'): z.ZodFlattenedError<T, string>;
export function handleZodError<T>(error: ZodError<T>, mode: 'flatten' | 'prettify' = 'flatten'): string | z.ZodFlattenedError<T, string> {
	if (mode === 'prettify') {
		return z.prettifyError(error);
	} else if (mode === 'flatten') {
		return z.flattenError(error);
	}
	throw new Error('Unhandled mode');
}

export async function base64ToBlob(base64Blob: string) {
	let audioBlob = await fetch(`data:audio/mpeg;base64,${base64Blob}`).then((r) => r.blob());
	return audioBlob;
}
