'use client';

import * as React from 'react';
import * as AlertDialogPrimitives from '@radix-ui/react-alert-dialog';
import styled, { keyframes } from 'styled-components';

import Button from '@/components/Button';
import Icon from '@/components/Icon';
import DescriptionText from '@/components/DescriptionText';
import Spacer from '@/components/Spacer';
import Loading from '@/components/Loading';

export default function AlertDialog({
	description,
	handleAction,
	extra,
	children,
	openState,
	onOpenChange,
	actionDisabled,
	...delegated
}: {
	description: string;
	handleAction: () => Promise<void>;
	extra?: React.ReactNode;
	openState?: boolean;
	onOpenChange?: (value: boolean) => void;
	actionDisabled?: boolean;
} & React.ComponentProps<typeof AlertDialogPrimitives.Content>) {
	let [open, setOpen] = React.useState(false);
	let [isLoading, startTransition] = React.useTransition();
	return (
		<AlertDialogPrimitives.Root open={openState || open} onOpenChange={onOpenChange || setOpen}>
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
							<CancelButton variant='outline' disabled={isLoading}>
								<Icon id='x' />
								&nbsp;Cancel
							</CancelButton>
						</AlertDialogPrimitives.Cancel>
						<ConfirmButton
							type='button'
							variant='outline'
							onClick={async () => {
								startTransition(async () => {
									await handleAction();
									if (openState === undefined) {
										setOpen(false);
									}
								});
							}}
							disabled={isLoading || actionDisabled === true}
						>
							{isLoading ? <Loading description='action ongoing' /> : <Icon id='enter' />}
							&nbsp;I&apos;m sure
						</ConfirmButton>
					</ActionWrapper>
				</Content>
			</AlertDialogPrimitives.Portal>
		</AlertDialogPrimitives.Root>
	);
}

var overlayShow = keyframes`
	from {
		opacity: 0;
	}
	to {
		opacity: 1;
	}
`;

var contentShow = keyframes`
	from {
		opacity: 0;
		transform: translate(-50%, -48%) scale(0.96);
	}
	to {
		opacity: 1;
		transform: translate(-50%, -50%) scale(1);
	}
`;

var Overlay = styled(AlertDialogPrimitives.Overlay)`
	background-color: var(--bg-overlay);
	position: fixed;
	inset: 0;

	@media (prefers-reduced-motion: no-preference) {
		animation: ${overlayShow} 150ms cubic-bezier(0.16, 1, 0.3, 1);
	}
`;
var Content = styled(AlertDialogPrimitives.Content)`
	html[data-theme='light'] & {
		--shadow-color: 0 0% 45%;
		--shadow-elevation-high: 0px 1px 1px hsl(var(--shadow-color) / 0.28), 0px 2.8px 2.7px -0.5px hsl(var(--shadow-color) / 0.26),
			0px 5.1px 5px -1px hsl(var(--shadow-color) / 0.24), 0px 8.9px 8.7px -1.5px hsl(var(--shadow-color) / 0.22),
			-0.1px 15.3px 14.9px -2px hsl(var(--shadow-color) / 0.2), -0.1px 25.2px 24.6px -2.5px hsl(var(--shadow-color) / 0.18),
			-0.2px 39.8px 38.8px -3px hsl(var(--shadow-color) / 0.16), -0.3px 60px 58.5px -3.5px hsl(var(--shadow-color) / 0.14);
	}

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

	@media (prefers-reduced-motion: no-preference) {
		animation: ${contentShow} 150ms cubic-bezier(0.16, 1, 0.3, 1);
	}
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
	--hover-bg-color: var(--bg-secondary);
`;

var CancelButton = styled(Button)`
	--hover-bg-color: var(--bg-secondary);
`;
