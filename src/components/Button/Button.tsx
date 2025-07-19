'use client';

import * as React from 'react';
import styled from 'styled-components';

interface ButtonProps {
	variant: 'fill' | 'outline' | 'ghost' | 'underlined';
}

function Button({ variant, children, ...delegated }: ButtonProps & React.ComponentProps<'button'>) {
	let Component;
	if (variant === 'fill') {
		Component = FillButton;
	} else if (variant === 'outline') {
		Component = OutlineButton;
	} else if (variant === 'ghost') {
		Component = GhostButton;
	} else if (variant === 'underlined') {
		Component = UnderlinedButton;
	} else {
		throw new Error(`Unrecognized Button variant: ${variant}`);
	}

	return <Component {...delegated}>{children}</Component>;
}

export default Button;

var Base = styled.button`
	margin: 0;
	border: none;
	background: transparent;
	cursor: pointer;
	text-align: left;
	font: inherit;
	position: relative;

	&:focus {
		outline-offset: 2px;
	}

	&:focus:not(:focus-visible) {
		outline: none;
	}

	// to make the target size a bit larger
	&::after {
		--tap-increment: -4px;
		content: '';
		position: absolute;
		top: var(--tap-increment);
		left: var(--tap-increment);
		right: var(--tap-increment);
		bottom: var(--tap-increment);
	}

	user-select: none;
	-webkit-tap-highlight-color: transparent;

	--text-color: var(--text-primary);
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 12px;
	padding: 6px 10px;
	color: var(--text-color);
`;

var FillButton = styled(Base)`
	--bg-color: var(--bg-tertiary);
	--hover-bg-color: var(--bg-tertiary-hover);
	background-color: var(--bg-color);
	@media (hover: hover) {
		&:hover {
			background-color: var(--hover-bg-color);
		}
	}
`;
var OutlineButton = styled(Base)`
	--hover-bg-color: var(--bg-primary-hover);
	border: 1px solid var(--border-medium);
	@media (hover: hover) {
		&:hover {
			background-color: var(--hover-bg-color);
		}
	}
`;

var GhostButton = styled(Base)`
	--hover-bg-color: var(--bg-primary-hover);
	padding: 6px;
	border-radius: 6px;
	@media (hover: hover) {
		&:hover {
			background-color: var(--hover-bg-color);
		}
	}
`;

var UnderlinedButton = styled(Base)`
	--hover-bg-color: var(--bg-tertiary);
	padding: 5px 4px;
	margin-right: 3px;
	margin-left: 3px;
	border-bottom: 1px dashed var(--border-medium);
	border-radius: 5px;
	line-height: 1;
	@media (hover: hover) {
		&:hover {
			background-color: var(--hover-bg-color);
		}
	}
`;
