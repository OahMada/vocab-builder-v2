'use client';

import * as React from 'react';

export function useInterval(callback: () => void, delay: number | null) {
	let intervalRef = React.useRef<number | null>(null);
	let savedCallback = React.useRef(callback);

	React.useEffect(() => {
		savedCallback.current = callback;
	}, [callback]);

	React.useEffect(() => {
		let tick = () => savedCallback.current();

		if (typeof delay === 'number') {
			intervalRef.current = window.setInterval(tick, delay);

			return () => {
				if (intervalRef.current !== null) {
					clearInterval(intervalRef.current);
				}
			};
		}
	}, [delay]);

	return intervalRef;
}
