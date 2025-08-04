import * as React from 'react';

export function useReadLocalStorage(key: string) {
	let returnValueRef = React.useRef<string | undefined>(undefined);

	React.useEffect(() => {
		let raw = window.localStorage.getItem('vocab-builder');
		let data = raw ? JSON.parse(raw) : {};

		returnValueRef.current = key in data ? data[key] : undefined;
	}, [key]);

	return returnValueRef;
}
