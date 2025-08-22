import * as React from 'react';
import { get } from 'idb-keyval';

export function useReadLocalDB<T>(updater: (data: T) => void): boolean {
	// useful for when the consuming component would fetch new data in absence of the local storage data
	let [isLoading, setIsLoading] = React.useState(true);

	// so that the passed in updater does't need to be wrapped in useCallback itself
	let savedUpdater = React.useRef(updater);
	React.useEffect(() => {
		savedUpdater.current = updater;
	}, [updater]);

	React.useEffect(() => {
		async function getBlob() {
			try {
				let data = await get<T>('audio');
				if (data) {
					savedUpdater.current(data);
				}
			} catch (error) {
				console.error('reading indexedDB acton failed', error);
			}
			setIsLoading(false);
		}
		getBlob();
	}, []);

	return isLoading;
}
