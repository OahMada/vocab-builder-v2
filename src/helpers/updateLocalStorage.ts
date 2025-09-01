import { LOCAL_STORAGE_KEY, LOCAL_STORAGE_OBJ } from '@/constants';

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
