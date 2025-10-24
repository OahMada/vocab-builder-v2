'use client';

import * as React from 'react';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import styled, { keyframes } from 'styled-components';

import { QUERIES } from '@/constants';

export var DropdownMenu = DropdownMenuPrimitive.Root;
export var DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;

export function DropdownMenuContent({ children, ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.Content>) {
	return (
		<DropdownMenuPrimitive.Portal>
			<Content {...props} align='end' sideOffset={7} arrowPadding={8}>
				{children}
				<Arrow width={15} height={8} />
			</Content>
		</DropdownMenuPrimitive.Portal>
	);
}

export var DropdownMenuItem = styled(DropdownMenuPrimitive.Item)`
	font-size: 1rem;
	display: flex;
	justify-content: flex-end;
	border-radius: 4px;
	padding: 4px 5px;
	user-select: none;
	min-width: 90px;

	&[data-highlighted] {
		background-color: var(--bg-dropdown-highlight);
	}

	&:active {
		background-color: var(--bg-dropdown-highlight);
	}

	/* replaced with a custom background color */
	outline: none;
`;

export var MobileDropdownMenuItem = styled(DropdownMenuItem)`
	@media ${QUERIES.tabletAndUp} {
		display: none;
	}
`;

var slideDownAndFade = keyframes`
	from {
		opacity: 0;
		transform: translateY(2px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
`;

var Content = styled(DropdownMenuPrimitive.Content)`
	background-color: var(--bg-dropdown);
	box-shadow: var(--shadow-elevation-medium);
	padding: 8px;
	border-radius: 12px;
	min-width: 100px;
	display: flex;
	flex-direction: column;
	gap: 5px;

	@media (prefers-reduced-motion: no-preference) {
		animation-duration: 400ms;
		animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
		will-change: transform, opacity;

		&[data-state='open'] {
			animation-name: ${slideDownAndFade};
		}
	}
`;

var Arrow = styled(DropdownMenuPrimitive.Arrow)`
	fill: var(--bg-dropdown);
`;
