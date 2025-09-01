import { LOCAL_STORAGE_KEY, LOCAL_STORAGE_OBJ } from '@/constants';
import * as React from 'react';

type LocalStorageKey = (typeof LOCAL_STORAGE_KEY)[keyof typeof LOCAL_STORAGE_KEY];

export function useReadLocalStorage<T>(key: LocalStorageKey, updater: (data: T) => void): boolean {
	// useful for when the consuming component would fetch new data in absence of the local storage data
	let [isLoading, setIsLoading] = React.useState(true);

	// so that the passed in updater does't need to be wrapped in useCallback itself
	let savedUpdater = React.useRef(updater);
	React.useEffect(() => {
		savedUpdater.current = updater;
	}, [updater]);

	React.useEffect(() => {
		let raw = window.localStorage.getItem(LOCAL_STORAGE_OBJ);
		let data = raw ? JSON.parse(raw) : {};

		savedUpdater.current(key in data ? data[key] : undefined);
		setIsLoading(false);
	}, [key]);

	return isLoading;
}
