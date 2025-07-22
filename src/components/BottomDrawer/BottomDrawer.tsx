'use client';

import * as React from 'react';
import * as Modal from '@radix-ui/react-dialog';
import styled from 'styled-components';
import VisuallyHidden from '@/components/VisuallyHidden';
import Icon from '@/components/Icon';
import Button from '@/components/Button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/Popover';
import DescriptionText from '@/components/DescriptionText';

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
						<Popover>
							<PopoverTrigger asChild={true}>
								<InfoButton variant='icon'>
									<Icon id='info' size={16} />
									<VisuallyHidden>Tip</VisuallyHidden>
								</InfoButton>
							</PopoverTrigger>
							<PopoverContent
								style={
									{
										'--shadow-color': '0deg 0% 3%',
										'--shadow-elevation-medium': `0px 0.7px 0.6px hsl(var(--shadow-color) / 0.46),
    0px 1.4px 1.3px -1.3px hsl(var(--shadow-color) / 0.37),
    0px 4.3px 3.9px -2.7px hsl(var(--shadow-color) / 0.29),
    -0.1px 11.8px 10.6px -4px hsl(var(--shadow-color) / 0.2)`,
									} as React.CSSProperties
								}
							>
								<DescriptionText>You don&apos;t have to repeat the sentence itself.</DescriptionText>
							</PopoverContent>
						</Popover>
						<CloseButton variant='icon' onClick={onDismiss}>
							<Icon id='x' />
							<VisuallyHidden>Dismiss menu</VisuallyHidden>
						</CloseButton>
					</TitleWrapper>
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
	box-shadow: var(--shadow-elevation-high);
`;

var InfoButton = styled(Button)`
	position: relative;
	/* optical alignment */
	top: 1px;
`;

var CloseButton = styled(Button)`
	margin-left: auto;
`;

var Title = styled(Modal.Title)`
	font-size: 1.5rem;
	font-weight: 350;
	line-height: 1;
`;

var TitleWrapper = styled.div`
	display: flex;
	align-items: center;
	gap: 5px;
`;
