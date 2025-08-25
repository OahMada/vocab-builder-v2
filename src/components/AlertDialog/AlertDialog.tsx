'use client';

import * as React from 'react';
import * as AlertDialogPrimitives from '@radix-ui/react-alert-dialog';
import styled from 'styled-components';
import Button from '@/components/Button';
import Icon from '@/components/Icon';
import DescriptionText from '@/components/DescriptionText';
import Spacer from '@/components/Spacer';
import Loading from '@/components/Loading';

export default function AlertDialog({
	description,
	handleDeleteAction,
	isDeleting,
	extra,
	children,
	...delegated
}: {
	description: string;
	handleDeleteAction: () => Promise<void>;
	isDeleting: boolean;
	extra?: React.ReactNode;
} & React.ComponentProps<typeof AlertDialogPrimitives.Content>) {
	let [open, setOpen] = React.useState(false);
	return (
		<AlertDialogPrimitives.Root open={open} onOpenChange={setOpen}>
			<AlertDialogPrimitives.Trigger asChild={true}>{children}</AlertDialogPrimitives.Trigger>
			<AlertDialogPrimitives.Portal>
				<Overlay />
				<Content {...delegated}>
					<Title>Confirm your action</Title>
					<AlertDialogPrimitives.Description asChild={true}>
						<DescriptionText>{description}</DescriptionText>
					</AlertDialogPrimitives.Description>
					{extra}
					<Spacer size={1} />
					<ActionWrapper>
						<AlertDialogPrimitives.Cancel asChild={true}>
							<Button variant='outline' disabled={isDeleting}>
								<Icon id='x' />
								&nbsp;Cancel
							</Button>
						</AlertDialogPrimitives.Cancel>
						<ConfirmButton
							type='button'
							variant='outline'
							onClick={async () => {
								await handleDeleteAction();
								setOpen(false);
							}}
							disabled={isDeleting}
						>
							{isDeleting ? <Loading description='action ongoing' /> : <Icon id='enter' />}
							&nbsp;I&apos;m sure
						</ConfirmButton>
					</ActionWrapper>
				</Content>
			</AlertDialogPrimitives.Portal>
		</AlertDialogPrimitives.Root>
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
