'use client';

import styled from 'styled-components';
import * as TabsPrimitives from '@radix-ui/react-tabs';

export var TabsRoot = styled(TabsPrimitives.Root)`
	display: flex;
	flex-direction: column;
	width: 100%;
	gap: 24px;
	height: 100%;
`;
export var TabsList = styled(TabsPrimitives.List)`
	display: flex;
	justify-content: center;
	align-self: center;
	width: 250px;
	border: 1px solid var(--border);
	border-radius: 12px;
	gap: 4px;
`;
export var TabsTrigger = TabsPrimitives.Trigger;
export var TabsContent = styled(TabsPrimitives.Content)`
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 12px;
	flex-grow: 1;
	outline: none;

	&[data-state='inactive'] {
		display: none;
	}
`;
