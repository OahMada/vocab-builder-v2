'use client';

import * as React from 'react';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import styled, { keyframes } from 'styled-components';

export var Popover = PopoverPrimitive.Root;
export var PopoverTrigger = PopoverPrimitive.Trigger;

export function PopoverContent({ children, ...delegated }: React.ComponentProps<typeof PopoverPrimitive.Content>) {
	return (
		<PopoverPrimitive.Portal>
			<Content sideOffset={5} {...delegated} side='top' collisionPadding={12}>
				{children}
			</Content>
		</PopoverPrimitive.Portal>
	);
}

var slideUpAndFade = keyframes`
	from {
		opacity: 0;
		transform: translateY(2px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
`;

var Content = styled(PopoverPrimitive.Content)`
	background-color: var(--bg-popover);
	padding: 4px 6px;
	border-radius: 8px;
	max-width: 250px;
	text-align: center;
	box-shadow: var(--shadow-elevation-medium);

	@media (prefers-reduced-motion: no-preference) {
		animation-duration: 400ms;
		animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
		will-change: transform, opacity;

		&[data-state='open'] {
			animation-name: ${slideUpAndFade};
		}
	}
`;
