'use client';

import { Theme } from '@/types';
import * as React from 'react';

export function useTheme(initialTheme: Theme) {
	let [theme, setTheme] = React.useState<Theme>(initialTheme);

	React.useEffect(() => {
		let target = document.documentElement;

		// Create observer for changes to data-theme attribute
		let observer = new MutationObserver(() => {
			let newTheme = target.dataset.theme as Theme;
			setTheme(newTheme);
		});

		observer.observe(target, {
			attributes: true,
			attributeFilter: ['data-theme'],
		});

		// Cleanup when unmounted
		return () => observer.disconnect();
	}, []);

	return theme;
}
