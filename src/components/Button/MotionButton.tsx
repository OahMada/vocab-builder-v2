'use client';

import * as React from 'react';
import * as m from 'motion/react-m';

import { Base, ButtonProps, FillButton, IconButton, OutlineButton } from './Shared';
import NavLink from '@/components/NavLink';

// split the component up for lazy loading
export function MotionButton({
	variant,
	href,
	children,
	...delegated
}: ButtonProps & React.ComponentProps<typeof Base> & React.ComponentProps<typeof m.button>) {
	let Component;
	if (variant === 'fill') {
		Component = FillButton;
	} else if (variant === 'outline') {
		Component = OutlineButton;
	} else if (variant === 'icon') {
		Component = IconButton;
	} else {
		throw new Error(`Unrecognized Button variant: ${variant}`);
	}

	return (
		<Component as={href ? NavLink : m.button} href={href} {...delegated}>
			{children}
		</Component>
	);
}
