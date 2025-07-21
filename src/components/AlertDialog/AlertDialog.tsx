'use client';

import * as React from 'react';
import * as AlertDialogPrimitives from '@radix-ui/react-alert-dialog';
import styled from 'styled-components';
import Button from '@/components/Button';
import Icon from '@/components/Icon';

export var AlertDialog = AlertDialogPrimitives.Root;
export var AlertDialogTrigger = AlertDialogPrimitives.Trigger;

export function AlertDialogContent({ ...delegated }: React.ComponentProps<typeof AlertDialogPrimitives.Content>) {
	return (
		<AlertDialogPrimitives.Portal>
			<Overlay />
			<Content {...delegated}>
				<Title>Confirm your action</Title>
				<Description>This action cannot be undone.</Description>
				<ActionWrapper>
					<AlertDialogPrimitives.Cancel asChild={true}>
						<CancelButton variant='outline'>
							<Icon id='x' />
							&nbsp;Cancel
						</CancelButton>
					</AlertDialogPrimitives.Cancel>
					<AlertDialogPrimitives.Action asChild={true}>
						<Button variant='outline'>
							<Icon id='enter' />
							&nbsp;Confirm
						</Button>
					</AlertDialogPrimitives.Action>
				</ActionWrapper>
			</Content>
		</AlertDialogPrimitives.Portal>
	);
}

var Overlay = styled(AlertDialogPrimitives.Overlay)`
	background-color: var(--bg-overlay);
	position: fixed;
	inset: 0;
`;
var Content = styled(AlertDialogPrimitives.Content)`
	background-color: var(--bg-modal);
	position: fixed;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	width: min(90vw, 500px);
	max-height: 85vh;
	border-radius: 12px;
	padding: 16px;
	color: var(--text-primary);
	display: flex;
	flex-direction: column;
	gap: 8px;
	--shadow-color: 0deg 0% 0%;
	--shadow-elevation-high: 0px 0.7px 0.6px hsl(var(--shadow-color) / 0.43), 0px 1.8px 1.6px -0.6px hsl(var(--shadow-color) / 0.39),
		0px 3.5px 3.2px -1.1px hsl(var(--shadow-color) / 0.35), 0px 6.6px 5.9px -1.7px hsl(var(--shadow-color) / 0.31),
		-0.1px 12.2px 11px -2.3px hsl(var(--shadow-color) / 0.27), -0.1px 21.1px 19px -2.9px hsl(var(--shadow-color) / 0.23),
		-0.2px 34.2px 30.8px -3.4px hsl(var(--shadow-color) / 0.19), -0.4px 52.5px 47.3px -4px hsl(var(--shadow-color) / 0.15);
	box-shadow: var(--shadow-elevation-high);
`;

var ActionWrapper = styled.div`
	display: flex;
	gap: 8px;
	align-self: flex-end;
	margin-top: 8px;
`;

var Title = styled(AlertDialogPrimitives.Title)`
	font-size: 1.5rem;
	font-weight: 400;
	line-height: 1;
`;

var Description = styled(AlertDialogPrimitives.Description)`
	color: var(--text-secondary);
	font-size: 0.8rem;
`;

var CancelButton = styled(Button)`
	--text-color: var(--text-status-warning);
`;
