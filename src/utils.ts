import z, { ZodError } from 'zod';
import { set, del } from 'idb-keyval';

import { LOCAL_STORAGE_KEY, LOCAL_STORAGE_OBJ, LOCAL_DB_KEY } from '@/constants';

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

export async function updateLocalDB(action: 'set', val: Blob): Promise<void>;
export async function updateLocalDB(action: 'delete'): Promise<void>;
export async function updateLocalDB(action: 'set' | 'delete', val?: Blob): Promise<void> {
	try {
		switch (action) {
			case 'set':
				await set(LOCAL_DB_KEY, val);
				break;
			case 'delete':
				await del(LOCAL_DB_KEY);
				break;
		}
	} catch (error) {
		throw error;
	}
}

type LocalStorageKey = (typeof LOCAL_STORAGE_KEY)[keyof typeof LOCAL_STORAGE_KEY];

export function updateLocalStorage<T>(action: 'save', key: LocalStorageKey, value: T): void;
export function updateLocalStorage(action: 'delete', key: LocalStorageKey): void;
export function updateLocalStorage<T>(action: 'save' | 'delete', key: LocalStorageKey, value?: T) {
	let raw = window.localStorage.getItem(LOCAL_STORAGE_OBJ);
	let data = raw ? JSON.parse(raw) : {};

	switch (action) {
		case 'save':
			data[key] = value;
			window.localStorage.setItem(LOCAL_STORAGE_OBJ, JSON.stringify(data));
			break;

		case 'delete':
			if (key in data) {
				delete data[key];
				window.localStorage.setItem(LOCAL_STORAGE_OBJ, JSON.stringify(data));
			}
			break;
	}
}

export async function deleteLocalData(includeSentence: boolean = false) {
	if (!includeSentence) {
		updateLocalStorage('delete', LOCAL_STORAGE_KEY.TRANSLATION);
		updateLocalStorage('delete', LOCAL_STORAGE_KEY.PIECES);
		updateLocalStorage('delete', LOCAL_STORAGE_KEY.NOTE);
	} else {
		window.localStorage.removeItem(LOCAL_STORAGE_OBJ);
	}
	await updateLocalDB('delete');
}

export function getLocalDateString(dateString: string | undefined) {
	if (!dateString) {
		return 'never';
	}

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

	let formatted = `${get('year')}-${get('month')}-${get('day')} ${get('hour')}:${get('minute')}`;
	return formatted;
}
