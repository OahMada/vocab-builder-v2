import * as React from 'react';

import { LOCAL_STORAGE_KEY } from '@/constants';

export function useReadLocalStorage(updater: (data: string) => void): void {
	// so that the passed in updater does't need to be wrapped in useCallback itself
	let savedUpdater = React.useRef(updater);
	React.useEffect(() => {
		savedUpdater.current = updater;
	}, [updater]);

	React.useEffect(() => {
		let sentence = window.localStorage.getItem(LOCAL_STORAGE_KEY);

		savedUpdater.current(sentence || '');
	}, []);
}
