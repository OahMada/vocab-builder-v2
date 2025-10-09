'use client';

import * as React from 'react';
import * as ModalPrimitives from '@radix-ui/react-dialog';
import styled, { css, keyframes } from 'styled-components';

import { QUERIES } from '@/constants';

import VisuallyHidden from '@/components/VisuallyHidden';
import Icon from '@/components/Icon';
import Button from '@/components/Button';

interface ModalProps {
	title: React.ReactNode;
	isOverlayTransparent?: boolean;
	contentPosition?: 'bottom' | 'middle';
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
	isOverlayTransparent = false,
	contentPosition = 'middle',
	onDismiss,
	isOpen,
}: ModalProps & React.ComponentProps<typeof ModalPrimitives.Root>) {
	return (
		<ModalPrimitives.Root open={isOpen} onOpenChange={onDismiss}>
			<ModalPrimitives.Portal>
				<OverLay $isOverlayTransparent={isOverlayTransparent} />
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
			</ModalPrimitives.Portal>
		</ModalPrimitives.Root>
	);
}

export default Modal;

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

var slideUp = keyframes`
	from {
		opacity: 0;
		transform: translateY(100%);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
`;

var slideLeft = keyframes`
	from {
		opacity: 0;
		transform: translateX(calc(100% + var(--viewport-offset)));
	}
	to {
		opacity: 1;
		transform: translateX(0);
	}
`;

var OverLay = styled(ModalPrimitives.Overlay)<{ $isOverlayTransparent: boolean }>`
	position: fixed;
	inset: 0;
	background: ${({ $isOverlayTransparent }) => ($isOverlayTransparent ? 'transparent' : 'var(--bg-overlay)')};

	@media (prefers-reduced-motion: no-preference) {
		animation: ${overlayShow} 150ms cubic-bezier(0.16, 1, 0.3, 1);
	}
`;

var Content = styled(ModalPrimitives.Content)<{ $position: string }>`
	position: fixed;
	padding: 16px;
	${({ $position }) => {
		if ($position === 'middle') {
			return css`
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
				width: min(90vw, 500px);
				border-radius: 16px;

				@media (prefers-reduced-motion: no-preference) {
					animation: ${contentShow} 150ms cubic-bezier(0.16, 1, 0.3, 1);
				}
			`;
		} else if ($position === 'bottom') {
			return css`
				bottom: 0;
				right: 0;
				width: 100%;
				border-top-left-radius: 16px;
				border-top-right-radius: 16px;
				padding-bottom: 32px;

				@media (prefers-reduced-motion: no-preference) {
					animation: ${slideUp} 150ms cubic-bezier(0.16, 1, 0.3, 1);
				}

				@media ${QUERIES.tabletAndUp} {
					--viewport-offset: 16px;
					width: 400px;
					bottom: 20px;
					right: 20px;
					border-bottom-left-radius: var(--viewport-offset);
					border-bottom-right-radius: var(--viewport-offset);

					@media (prefers-reduced-motion: no-preference) {
						animation: ${slideLeft} 150ms cubic-bezier(0.16, 1, 0.3, 1);
					}
				}
			`;
		}
	}}
	background: var(--bg-modal);
	display: flex;
	flex-direction: column;
	gap: 12px;
	box-shadow: var(--shadow-elevation-high);
	isolation: isolate;
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
