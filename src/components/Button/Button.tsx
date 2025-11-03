'use client';

import * as React from 'react';

import NavLink from '@/components/NavLink';
import { Base, ButtonProps, FillButton, IconButton, OutlineButton } from './Shared';

export function Button({ variant, href, children, ...delegated }: ButtonProps & React.ComponentProps<typeof Base>) {
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
		<Component as={href ? NavLink : 'button'} href={href} {...delegated}>
			{children}
		</Component>
	);
}
