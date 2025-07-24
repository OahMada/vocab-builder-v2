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
	--shadow-color: 0deg 0% 3%;
	--shadow-elevation-medium: 0px 0.7px 0.6px hsl(var(--shadow-color) / 0.46), 0px 1.5px 1.4px -1.3px hsl(var(--shadow-color) / 0.37),
		0px 4.4px 4px -2.7px hsl(var(--shadow-color) / 0.29), -0.1px 12px 10.8px -4px hsl(var(--shadow-color) / 0.2);
	background-color: var(--bg-popover);
	padding: 4px 6px;
	border-radius: 8px;
	max-width: 250px;
	text-align: center;
	box-shadow: var(--shadow-elevation-medium);
`;
