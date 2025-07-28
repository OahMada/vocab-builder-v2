'use client';

import * as React from 'react';
import * as ModalPrimitives from '@radix-ui/react-dialog';
import styled, { css } from 'styled-components';
import VisuallyHidden from '@/components/VisuallyHidden';
import Icon from '@/components/Icon';
import Button from '@/components/Button';

interface ModalProps {
	title: React.ReactNode;
	style?: React.CSSProperties;
	contentPosition?: 'bottom' | 'middle' | 'full-screen';
	onDismiss: () => void;
	isOpen: boolean;
}

var Title = styled(ModalPrimitives.Title)`
	font-size: 1.5rem;
	font-weight: 350;
	line-height: 1;
`;

export { Title };

function Modal({
	title,
	children,
	style,
	contentPosition = 'middle',
	onDismiss,
	isOpen,
}: ModalProps & React.ComponentProps<typeof ModalPrimitives.Root>) {
	return (
		<ModalPrimitives.Root open={isOpen} onOpenChange={onDismiss}>
			<ModalPrimitives.Portal>
				<Wrapper style={{ ...style } as React.CSSProperties}>
					<OverLay />
					<Content $position={contentPosition}>
						<TitleWrapper>
							<ModalPrimitives.Title asChild={true}>{title}</ModalPrimitives.Title>
							<CloseButton variant='icon' onClick={onDismiss}>
								<Icon id='x' />
								<VisuallyHidden>Dismiss menu</VisuallyHidden>
							</CloseButton>
						</TitleWrapper>
						{/* to suppress the warning, because applying aria-describedby={undefined} to ModalContent couldn't solve the problem */}
						<VisuallyHidden>
							<ModalPrimitives.Description></ModalPrimitives.Description>
						</VisuallyHidden>
						{children}
					</Content>
				</Wrapper>
			</ModalPrimitives.Portal>
		</ModalPrimitives.Root>
	);
}

export default Modal;

var Wrapper = styled.div``;

var OverLay = styled(ModalPrimitives.Overlay)`
	position: fixed;
	inset: 0;
	background: var(--bg-overlay);
`;

var Content = styled(ModalPrimitives.Content)<{ $position: string }>`
	position: fixed;
	${({ $position }) => {
		if ($position === 'middle') {
			return css`
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
				width: min(90vw, 500px);
				border-radius: 16px;
			`;
		} else if ($position === 'bottom') {
			return css`
				bottom: 0;
				right: 0;
				width: 100%;
				min-height: 55dvh;
				border-top-left-radius: 16px;
				border-top-right-radius: 16px;
			`;
		} else if ($position === 'full-screen') {
			return css`
				inset: 0;
			`;
		}
	}}
	background: var(--bg-modal);
	padding: 16px;
	color: var(--text-primary);
	display: flex;
	flex-direction: column;
	gap: 12px;
	box-shadow: var(--shadow-elevation-high);
`;

var CloseButton = styled(Button)`
	margin-left: auto;
	position: relative;
	top: 3px;
`;

var TitleWrapper = styled.div`
	display: flex;
	align-items: baseline;
`;
