import * as React from 'react';

export function useIsScrollingToEnd(isLoadingData: boolean): boolean {
	let [isScrollingToEnd, setIsScrollingToEnd] = React.useState(false);

	React.useEffect(() => {
		function handleScroll() {
			let scrollY = window.scrollY;
			let viewport = window.innerHeight;
			let fullHeight = document.documentElement.scrollHeight;

			let leftScroll = fullHeight - (scrollY + viewport);
			// add !isLoadingData as condition to prevent isScrollingToEnd being set to true again
			if (leftScroll < viewport * 0.8 && !isLoadingData) {
				setIsScrollingToEnd(true);
			}
		}

		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, [isLoadingData]);

	React.useEffect(() => {
		if (isLoadingData) {
			setIsScrollingToEnd(false);
		}
	}, [isLoadingData]);

	return isScrollingToEnd;
}
