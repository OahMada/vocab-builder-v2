'use client';

import * as React from 'react';
import styled, { css } from 'styled-components';
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

export function Toast({ title, content, contentType, removeToast, ...props }: ToastProps) {
	let [open, setIsOpen] = React.useState(true);

	return (
		<Root
			{...props}
			duration={3000}
			open={open}
			onOpenChange={(open) => {
				setIsOpen(open);
				if (!open && removeToast) {
					removeToast();
				}
			}}
		>
			{title && <Title>{title}</Title>}
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
`;

var Title = styled(ToastPrimitives.Title)`
	font-size: 12px;
	font-weight: 600;
`;

var Description = styled(ToastPrimitives.Description)<{ $contentType: 'error' | 'notice' }>`
	font-size: 13px;
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

	white-space: nowrap;
	text-overflow: ellipsis;
	/* hide text that are more than one lines */
	overflow: hidden;
`;

var CloseButton = styled(Button)`
	--hover-bg-color: var(--bg-tertiary-hover);
	--button-size: calc(var(--icon-size) + var(--padding) * 2);
	--button-offset: calc((13px * 1.5 + var(--root-padding) * 2 - var(--button-size)) / 2);
	position: absolute;
	top: var(--button-offset);
	right: var(--button-offset);
`;

export var ToastProvider = ToastPrimitives.Provider;
export var ToastViewport = styled(ToastPrimitives.Viewport)<{ $position: 'top' | 'bottom' }>`
	position: fixed;
	${({ $position }) => {
		if ($position === 'top') {
			return css`
				top: 20px;
			`;
		} else if ($position === 'bottom') {
			return css`
				bottom: 20px;
			`;
		}
	}}
	right: 0;
	padding: 16px;
	width: 390px;
	max-width: 100vw;
	list-style: none;
	outline: none;
	display: flex;
	flex-direction: column;
	gap: 3px;
	z-index: 20;
`;
