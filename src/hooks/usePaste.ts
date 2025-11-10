import * as React from 'react';

export function usePaste(callback: (text: string) => void) {
	let savedCallback = React.useRef(callback);

	React.useEffect(() => {
		savedCallback.current = callback;
	}, [callback]);

	React.useEffect(() => {
		function handlePaste(e: ClipboardEvent) {
			e.preventDefault();
			let clipboardText = e.clipboardData?.getData('text');
			if (clipboardText) savedCallback.current(clipboardText);
		}

		window.addEventListener('paste', handlePaste);
		return () => window.removeEventListener('paste', handlePaste);
	}, []);
}
