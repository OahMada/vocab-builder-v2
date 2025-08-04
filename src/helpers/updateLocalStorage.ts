export function updateLocalStorage(action: 'save', key: string, value: string): void;
export function updateLocalStorage(action: 'delete', key: string): void;
export function updateLocalStorage(action: 'save' | 'delete', key: string, value?: string) {
	let raw = window.localStorage.getItem('vocab-builder');
	let data = raw ? JSON.parse(raw) : {};
	let returnValue: string | undefined;

	switch (action) {
		case 'save':
			data[key] = value;
			window.localStorage.setItem('vocab-builder', JSON.stringify(data));
			break;

		case 'delete':
			if (key in data) {
				delete data[key];
				window.localStorage.setItem('vocab-builder', JSON.stringify(data));
			}
			break;
	}

	return returnValue;
}
