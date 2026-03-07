import * as React from 'react';
import { useIsHoverable } from './useIsHoverable';

export function useAutoFocus(ref: React.RefObject<HTMLTextAreaElement | null>) {
	let isHoverable = useIsHoverable();
	React.useEffect(() => {
		let input = ref.current;

		if (!input) return;

		let focusInput = () => {
			input.focus();

			if (!isHoverable) {
				setTimeout(() => {
					input.scrollIntoView({
						block: 'center',
					});
				}, 500);
			}
		};

		focusInput();
	}, [isHoverable, ref]);
}
