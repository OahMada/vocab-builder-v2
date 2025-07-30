'use client';

import React from 'react';

export function useTimeout(callback: () => void, delay: number | null) {
	let timeoutRef = React.useRef<null | number>(null);
	let savedCallback = React.useRef(callback);

	React.useEffect(() => {
		savedCallback.current = callback;
	}, [callback]);

	React.useEffect(() => {
		let tick = () => {
			savedCallback.current();
		};

		if (typeof delay === 'number') {
			timeoutRef.current = window.setTimeout(tick, delay);

			return () => {
				if (timeoutRef.current !== null) {
					window.clearTimeout(timeoutRef.current);
				}
			};
		}
	}, [delay]);

	return timeoutRef;
}
