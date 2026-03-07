import * as React from 'react';
import { useIsHoverable } from './useIsHoverable';

export function useAutoFocus(enabled: boolean = true, ref?: React.RefObject<HTMLTextAreaElement | null>) {
	let isHoverable = useIsHoverable();
	React.useEffect(() => {
		let input = ref?.current;
		if (!input) return;

		let focusInput = () => {
			if (enabled) {
				input.focus();
				if (!isHoverable) {
					setTimeout(() => {
						input.scrollIntoView({
							block: 'center',
						});
					}, 1000);
				}
			}
		};

		focusInput();
	}, [enabled, isHoverable, ref]);
}
