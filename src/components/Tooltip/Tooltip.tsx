'use client';

import * as React from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import styled, { keyframes } from 'styled-components';

export default function Tooltip({
	children,
	tip,
	...props
}: { tip: string; children: React.ReactNode } & React.ComponentProps<typeof TooltipPrimitive.Content>) {
	return (
		<TooltipPrimitive.Root>
			<TooltipPrimitive.Trigger asChild={true}>{children}</TooltipPrimitive.Trigger>
			<Content side='top' align='center' sideOffset={8} {...props}>
				{tip}
			</Content>
		</TooltipPrimitive.Root>
	);
}

export var TooltipProvider = TooltipPrimitive.Provider;

var slideDownAndFade = keyframes`
	from {
		opacity: 0;
		transform: translateY(-2px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
`;

var Content = styled(TooltipPrimitive.Content)`
	background-color: var(--bg-popover);
	padding: 8px 12px;
	border-radius: 8px;
	box-shadow: var(--shadow-elevation-medium);
	user-select: none;
	font-size: 0.8rem;
	color: var(--text-secondary);
	font-weight: 500;
	max-width: 500px;
	text-align: center;

	@media (prefers-reduced-motion: no-preference) {
		animation-duration: 400ms;
		animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
		will-change: transform, opacity;
		&[data-state='delayed-open'][data-side='top'] {
			animation-name: ${slideDownAndFade};
		}
	}
`;
