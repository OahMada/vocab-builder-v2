import * as React from 'react';

export function useReadLocalStorage<T>(key: string, updater: (data: T) => void): boolean {
	// useful for when the consuming component would fetch new data in absence of the local storage data
	let [isLoading, setIsLoading] = React.useState(true);

	// so that the passed in updater does't need to be wrapped in useCallback itself
	let savedUpdater = React.useRef(updater);
	React.useEffect(() => {
		savedUpdater.current = updater;
	}, [updater]);

	React.useEffect(() => {
		let raw = window.localStorage.getItem('vocab-builder');
		let data = raw ? JSON.parse(raw) : {};

		savedUpdater.current(key in data ? data[key] : undefined);
		setIsLoading(false);
	}, [key]);

	return isLoading;
}
