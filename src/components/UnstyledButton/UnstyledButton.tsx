'use client';

import styled from 'styled-components';

export default styled.button<{ display?: 'inline' | 'inline-block' | 'block' }>`
	display: ${(props) => props.display || 'block'};
	margin: 0;
	padding: 0;
	border: none;
	background: transparent;
	cursor: pointer;
	text-align: left;
	font: inherit;
	color: inherit;
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
`;
