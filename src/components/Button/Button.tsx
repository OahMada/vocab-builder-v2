'use client';

import * as React from 'react';
import styled from 'styled-components';
import UnstyledButton from '@/components/UnstyledButton';

interface ButtonProps {
	variant: 'fill' | 'outline';
}

function Button({ variant, children, ...delegated }: ButtonProps & React.ComponentProps<'button'>) {
	let Component;
	if (variant === 'fill') {
		Component = FillButton;
	} else if (variant === 'outline') {
		Component = OutlineButton;
	} else {
		throw new Error(`Unrecognized Button variant: ${variant}`);
	}

	return <Component {...delegated}>{children}</Component>;
}

export default Button;

var Base = styled(UnstyledButton)`
	display: flex;
	align-items: center;
	border-radius: 12px;
	padding: 6px 10px;
	color: var(--text-primary);
`;

var FillButton = styled(Base)`
	background-color: var(--bg-tertiary);

	@media (hover: hover) {
		&:hover {
			background-color: var(--bg-tertiary-hover);
		}
	}
`;
var OutlineButton = styled(Base)`
	border: 1px solid var(--border-medium);
`;
