import * as React from 'react';

export function useIsHoverable() {
	let [isHoverable, setIsHoverable] = React.useState(false);
	React.useEffect(() => {
		if (window.matchMedia('(hover: hover)').matches) {
			setIsHoverable(true);
		} else {
			setIsHoverable(false);
		}
	}, []);
	return isHoverable;
}
