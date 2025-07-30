'use client';

import * as React from 'react';
import * as AlertDialogPrimitives from '@radix-ui/react-alert-dialog';
import styled from 'styled-components';
import Button from '@/components/Button';
import Icon from '@/components/Icon';
import DescriptionText from '@/components/DescriptionText';
import Spacer from '@/components/Spacer';

export var AlertDialog = AlertDialogPrimitives.Root;
export var AlertDialogTrigger = AlertDialogPrimitives.Trigger;

export function AlertDialogContent({
	description,
	children,
	...delegated
}: { description: string } & React.ComponentProps<typeof AlertDialogPrimitives.Content>) {
	return (
		<AlertDialogPrimitives.Portal>
			<Overlay />
			<Content {...delegated}>
				<Title>Confirm your action</Title>
				<AlertDialogPrimitives.Description asChild={true}>
					<DescriptionText>{description}</DescriptionText>
				</AlertDialogPrimitives.Description>
				{children}
				<Spacer size={1} />
				<ActionWrapper>
					<AlertDialogPrimitives.Cancel asChild={true}>
						<Button variant='outline'>
							<Icon id='x' />
							&nbsp;Cancel
						</Button>
					</AlertDialogPrimitives.Cancel>
					<AlertDialogPrimitives.Action asChild={true}>
						<ConfirmButton variant='outline'>
							<Icon id='enter' />
							&nbsp;I&apos;m sure
						</ConfirmButton>
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
	display: flex;
	flex-direction: column;
	gap: 5px;
	box-shadow: var(--shadow-elevation-high);
`;

var ActionWrapper = styled.div`
	display: flex;
	gap: 8px;
	align-self: flex-end;
`;

var Title = styled(AlertDialogPrimitives.Title)`
	font-size: 1.5rem;
	font-weight: 350;
	line-height: 1;
`;

var ConfirmButton = styled(Button)`
	--text-color: var(--text-status-warning);
`;
