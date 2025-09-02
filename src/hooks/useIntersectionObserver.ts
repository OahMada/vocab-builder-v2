'use client';

import * as React from 'react';

interface UseIntersectionObserverOptions {
	threshold?: number | number[];
}

/**
 * Custom hook to detect when an element enters the viewport.
 * @param options IntersectionObserver options
 * @returns [ref, isIntersecting]
 */
export function useIntersectionObserver<T extends Element = Element>({ threshold }: UseIntersectionObserverOptions = {}): [
	React.RefObject<T | null>,
	boolean
] {
	let ref = React.useRef<T | null>(null);
	let [isIntersecting, setIsIntersecting] = React.useState(false);

	React.useEffect(() => {
		let element = ref.current;
		if (!element) return;

		let observer = new IntersectionObserver(
			([entry]) => {
				setIsIntersecting(entry.isIntersecting);
			},
			{ threshold }
		);

		observer.observe(element);

		return () => {
			observer.disconnect();
		};
	}, [ref, threshold]);

	return [ref, isIntersecting];
}
