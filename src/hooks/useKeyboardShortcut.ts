import * as React from 'react';

type ModifierKeys = 'Alt';
type NormalKeys = string;
type KeyPair = [ModifierKeys, NormalKeys];

export function useKeyboardShortcut(keys: KeyPair, callback: () => void) {
	let savedCallback = React.useRef(callback);

	React.useEffect(() => {
		savedCallback.current = callback;
	}, [callback]);

	React.useEffect(() => {
		async function handleKeyDown(e: KeyboardEvent) {
			if (keys[0] === 'Alt')
				if (e.altKey && e.code === keys[1]) {
					e.preventDefault();
					savedCallback.current();
				}
		}
		document.addEventListener('keydown', handleKeyDown);
		return () => {
			document.removeEventListener('keydown', handleKeyDown);
		};
	}, [keys]);
}
