'use client';

import * as React from 'react';
import styled from 'styled-components';

import { LIGHT_COLORS, DARK_COLORS } from '@/constants';
import { setCookie } from '@/lib';
import { Theme } from '@/types';
import { readCookie } from '@/lib';

import VisuallyHidden from '@/components/VisuallyHidden';
import { Button } from '@/components/Button';
import Icon from '@/components/Icon';

function ThemeToggle({ initialTheme }: { initialTheme: Theme }) {
	let [theme, setTheme] = React.useState<Theme>(initialTheme);

	React.useEffect(() => {
		let currentTheme = readCookie('color-theme');
		if (currentTheme) {
			setTheme(currentTheme as Theme);
		}
	}, []);

	// https://github.com/joy-of-react/next-dark-mode/blob/main/src/components/DarkLightToggle/DarkLightToggle.js
	function handleClick() {
		let nextTheme = theme === 'light' ? 'dark' : 'light';

		// 1 — Change the state variable, for the sun/moon icon
		setTheme(nextTheme as Theme);

		// 2 — Update the cookie, for the user's next visit
		setCookie('color-theme', nextTheme);

		// 3 — Update the DOM to present the new colors
		let root = document.documentElement;
		let colors = nextTheme === 'light' ? LIGHT_COLORS : DARK_COLORS;

		// 3.1 — Edit the data-attribute, so that we can apply CSS
		// conditionally based on the theme.
		root.setAttribute('data-theme', nextTheme);

		// 3.2 — Swap out the actual colors on the <html> tag.
		//       We do this by iterating over each CSS variable
		//       and setting it as a new inline style.
		Object.entries(colors).forEach(([key, value]) => {
			root.style.setProperty(key, value);
		});
	}

	return (
		<ThemeButton variant='icon' onClick={handleClick}>
			{theme === 'light' ? <Icon id='light' /> : <DarkIcon id='dark' />}
			<VisuallyHidden>Toggle dark / light theme </VisuallyHidden>
		</ThemeButton>
	);
}

export default ThemeToggle;

var ThemeButton = styled(Button)`
	--hover-bg-color: var(--bg-secondary);
`;

var DarkIcon = styled(Icon)`
	transform: scale(0.85);
`;
