import z, { ZodError } from 'zod';

import { LOCAL_STORAGE_KEY } from '@/constants';

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

export function updateLocalStorage(action: 'save', value: string): void;
export function updateLocalStorage(action: 'delete'): void;
export function updateLocalStorage(action: 'save' | 'delete', value?: string) {
	switch (action) {
		case 'save':
			if (value === undefined) {
				throw new Error('Value must be provided when saving to localstorage.');
			}
			window.localStorage.setItem(LOCAL_STORAGE_KEY, value);
			break;

		case 'delete':
			window.localStorage.removeItem(LOCAL_STORAGE_KEY);
			break;
	}
}

export function getLocalDateString(dateString: string, includeTime: boolean = true) {
	let date = new Date(dateString);
	let formatter = new Intl.DateTimeFormat(undefined, {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
		hour12: false,
		timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
	});

	let parts = formatter.formatToParts(date);
	function get(type: string) {
		return parts.find((p) => p.type === type)?.value;
	}

	let formatted = '';

	if (includeTime) {
		formatted = `${get('year')}-${get('month')}-${get('day')} ${get('hour')}:${get('minute')}`;
	} else {
		formatted = `${get('year')}-${get('month')}-${get('day')}`;
	}
	return formatted;
}

export function convertPrice(priceString: string) {
	return Number(priceString.match(/\d/g)?.join(''));
}
