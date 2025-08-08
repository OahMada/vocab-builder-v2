import * as React from 'react';

export function useReadLocalStorage<T>(key: string): [T | undefined, boolean] {
	let [returnValue, setReturnValue] = React.useState<T | undefined>(undefined);
	let [isLoading, setIsLoading] = React.useState(true);

	React.useEffect(() => {
		let raw = window.localStorage.getItem('vocab-builder');
		let data = raw ? JSON.parse(raw) : {};

		setReturnValue(key in data ? data[key] : undefined);
		setIsLoading(false);
	}, [key]);

	return [returnValue, isLoading];
}
