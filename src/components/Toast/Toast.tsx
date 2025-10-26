'use client';

import * as React from 'react';
import styled, { css, keyframes } from 'styled-components';
import * as ToastPrimitives from '@radix-ui/react-toast';

import Button from '@/components/Button';
import Icon from '@/components/Icon';
import VisuallyHidden from '@/components/VisuallyHidden';

type ToastProps = {
	contentType: 'error' | 'notice';
	content: React.ReactNode;
	title?: string;
	removeToast?: () => void;
} & React.ComponentProps<typeof ToastPrimitives.Root>;

function Toast({ title, content, contentType, removeToast, ...props }: ToastProps) {
	let [open, setIsOpen] = React.useState(true);

	return (
		<Root
			{...props}
			duration={3000}
			open={open}
			onOpenChange={(open) => {
				setIsOpen(open);
				// https://github.com/radix-ui/primitives/issues/2233#issuecomment-1821222005
				if (!open) document.getElementById('toast')?.blur();
				if (!open && removeToast) {
					// to let the animation play
					window.setTimeout(() => {
						removeToast();
					}, 100);
				}
			}}
		>
			{title && <Title $contentType={contentType}>{title}</Title>}
			<Description $contentType={contentType}>{content}</Description>
			<ToastPrimitives.Close asChild={true}>
				<CloseButton variant='icon' style={{ '--icon-size': '16px' } as React.CSSProperties}>
					<Icon id='x' size={16} />
					<VisuallyHidden>Close Toast</VisuallyHidden>
				</CloseButton>
			</ToastPrimitives.Close>
		</Root>
	);
}

export default Toast;

var hide = keyframes`
	from {
		opacity: 1;
	}
	to {
		opacity: 0;
	}
`;

var slideIn = keyframes`
	from {
		transform: translateX(calc(100% + var(--viewport-padding)));
	}
	to {
		transform: translateX(0);
	}
`;

var swipeOut = keyframes`
	from {
		transform: translateX(var(--radix-toast-swipe-end-x));
	}
	to {
		transform: translateX(calc(100% + var(--viewport-padding)));
	}
`;

var Root = styled(ToastPrimitives.Root)`
	--root-padding: 12px;
	background-color: var(--bg-popover);
	border-radius: 12px;
	box-shadow: var(--shadow-elevation-high);
	padding: var(--root-padding);
	padding-right: 50px;
	display: flex;
	flex-direction: column;
	position: relative;

	@media (prefers-reduced-motion: no-preference) {
		&[data-state='open'] {
			animation: ${slideIn} 150ms cubic-bezier(0.16, 1, 0.3, 1);
		}
		&[data-state='closed'] {
			animation: ${hide} 100ms ease-in;
		}
		&[data-swipe='move'] {
			transform: translateX(var(--radix-toast-swipe-move-x));
		}
		&[data-swipe='cancel'] {
			transform: translateX(0);
			transition: transform 200ms ease-out;
		}
		&[data-swipe='end'] {
			animation: ${swipeOut} 100ms ease-out;
		}
	}
`;

var Title = styled(ToastPrimitives.Title)<{ $contentType: 'error' | 'notice' }>`
	font-size: 12px;
	font-weight: 600;

	${({ $contentType }) => {
		if ($contentType === 'error') {
			return css`
				color: var(--text-status-warning);
			`;
		} else if ($contentType === 'notice') {
			return css`
				color: var(--text-secondary);
			`;
		}
	}}
`;

var Description = styled(ToastPrimitives.Description)<{ $contentType: 'error' | 'notice' }>`
	font-size: 16px;
	${({ $contentType }) => {
		if ($contentType === 'error') {
			return css`
				color: var(--text-status-warning);
			`;
		} else if ($contentType === 'notice') {
			return css`
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 2;
				/* hide text that are more than one lines */
				overflow: hidden;
			`;
		}
	}}
`;

var CloseButton = styled(Button)`
	--hover-bg-color: var(--bg-tertiary-hover);
	--button-size: calc(var(--icon-size) + var(--padding) * 2);
	--button-offset: calc((16px * 1.5 + var(--root-padding) * 2 - var(--button-size)) / 2);
	position: absolute;
	top: var(--button-offset);
	right: var(--button-offset);
`;

export var ToastProvider = ToastPrimitives.Provider;
export var ToastViewport = styled(ToastPrimitives.Viewport)`
	--viewport-padding: 16px;
	position: fixed;
	bottom: 20px;
	right: 0;
	padding: var(--viewport-padding);
	width: 390px;
	max-width: 100vw;
	list-style: none;
	outline: none;
	display: flex;
	flex-direction: column;
	gap: 3px;
	z-index: 20;
`;
