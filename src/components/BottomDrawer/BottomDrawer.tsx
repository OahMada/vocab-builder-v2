'use client';

import * as React from 'react';
import * as Modal from '@radix-ui/react-dialog';
import styled from 'styled-components';
import VisuallyHidden from '@/components/VisuallyHidden';
import Icon from '@/components/Icon';
import Button from '@/components/Button';

interface BottomDrawerProps {
	isOpen: boolean;
	onDismiss: () => void;
}

function BottomDrawer({ isOpen, onDismiss, children }: BottomDrawerProps & React.ComponentProps<'div'>) {
	return (
		<Modal.Root open={isOpen} onOpenChange={onDismiss}>
			<Modal.Portal>
				<OverLay />
				<Content>
					<TitleWrapper>
						<Title>Ask Anything</Title>
						<Button variant='ghost' onClick={onDismiss}>
							<Icon id='x' />
							<VisuallyHidden>Dismiss menu</VisuallyHidden>
						</Button>
					</TitleWrapper>
					<Description>You don&apos;t have to repeat the sentence itself.</Description>
					{children}
				</Content>
			</Modal.Portal>
		</Modal.Root>
	);
}

export default BottomDrawer;

var OverLay = styled(Modal.Overlay)`
	position: fixed;
	inset: 0;
	background: transparent;
`;

var Content = styled(Modal.Content)`
	position: fixed;
	right: 0;
	bottom: 0;
	background: var(--bg-modal);
	width: 100%;
	min-height: 50dvh;
	border-top-left-radius: 16px;
	border-top-right-radius: 16px;
	padding: 16px 28px;
	color: var(--text-primary);
	display: flex;
	flex-direction: column;
	gap: 12px;
`;

var Description = styled(Modal.Description)`
	font-size: 12.8px;
	color: var(--text-tertiary);
	font-weight: 500;

	/* optical alignment */
	margin-top: -14px;
	margin-bottom: 4px;
`;

var Title = styled(Modal.Title)`
	font-size: 1.5rem;
	font-weight: 350;
	line-height: 1;
`;

var TitleWrapper = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
`;
