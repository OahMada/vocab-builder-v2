export function updateLocalStorage<T>(action: 'save', key: string, value: T): void;
export function updateLocalStorage(action: 'delete', key: string): void;
export function updateLocalStorage<T>(action: 'save' | 'delete', key: string, value?: T) {
	let raw = window.localStorage.getItem('vocab-builder');
	let data = raw ? JSON.parse(raw) : {};

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
}
