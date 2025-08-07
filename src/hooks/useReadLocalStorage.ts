import * as React from 'react';

export function useReadLocalStorage<T>(key: string): [React.RefObject<T | undefined>, React.RefObject<boolean>] {
	let returnValueRef = React.useRef<T | undefined>(undefined);
	let loadingRef = React.useRef(true);

	React.useEffect(() => {
		let raw = window.localStorage.getItem('vocab-builder');
		let data = raw ? JSON.parse(raw) : {};

		returnValueRef.current = key in data ? data[key] : undefined;
		loadingRef.current = false;
	}, [key]);

	return [returnValueRef, loadingRef];
}
