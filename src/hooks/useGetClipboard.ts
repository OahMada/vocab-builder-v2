import * as React from 'react';

export function useGetClipboard(): { isClipboardDisabled: boolean; getClipboardRef: React.RefObject<(() => Promise<string>) | null> } {
	let [isClipboardDisabled, setIsClipboardDisabled] = React.useState(false);
	let getClipboardRef = React.useRef<null | (() => Promise<string>)>(null);

	let getClipboard = React.useCallback(async () => {
		let text = await navigator.clipboard.readText();
		return text;
	}, []);

	React.useEffect(() => {
		if (!Boolean(navigator.clipboard.readText)) {
			setIsClipboardDisabled(true);
			return;
		}
		getClipboardRef.current = getClipboard;
	}, [getClipboard]);

	return { isClipboardDisabled, getClipboardRef };
}
