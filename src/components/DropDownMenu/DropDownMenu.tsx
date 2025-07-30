'use client';

import * as React from 'react';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import styled from 'styled-components';

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
	padding: 3px 5px;
	user-select: none;

	&[data-highlighted] {
		background-color: var(--bg-secondary);
	}

	/* replaced with a custom background color */
	outline: none;
`;

var Content = styled(DropdownMenuPrimitive.Content)`
	background-color: var(--bg-popover);
	box-shadow: var(--shadow-elevation-medium);
	padding: 8px;
	border-radius: 12px;
	min-width: 100px;
	display: flex;
	flex-direction: column;
	gap: 3px;
`;

var Arrow = styled(DropdownMenuPrimitive.Arrow)`
	fill: var(--bg-popover);
`;
