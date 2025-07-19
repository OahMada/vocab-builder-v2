'use client';

import * as React from 'react';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import styled from 'styled-components';

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

var Content = styled(PopoverPrimitive.Content)`
	background-color: var(--bg-popover);
	border: 1px solid var(--border-light);
	padding: 4px 6px;
	border-radius: 8px;
	max-width: 250px;
	text-align: center;
`;
