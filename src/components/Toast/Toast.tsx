'use client';

import * as React from 'react';
import styled from 'styled-components';
import * as ToastPrimitives from '@radix-ui/react-toast';
import Button from '@/components/Button';
import Icon from '@/components/Icon';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

interface ToastProps {
	title?: string;
	content: React.ReactNode;
}

export function Toast({ title, content, ...props }: ToastProps & React.ComponentProps<typeof ToastPrimitives.Root>) {
	return (
		<Root {...props} duration={100000}>
			{title && <Title>{title}</Title>}
			<Description>{content}</Description>
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
	color: var(--text-status-warning);
	position: relative;
`;

var Title = styled(ToastPrimitives.Title)`
	font-size: 15px;
	font-weight: 500;
`;

var Description = styled(ToastPrimitives.Description)`
	font-size: 13px;
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
export var ToastViewport = styled(ToastPrimitives.Viewport)`
	position: fixed;
	bottom: 0;
	right: 0;
	padding: 16px;
	width: 390px;
	max-width: 100vw;
	list-style: none;
	outline: none;
`;
