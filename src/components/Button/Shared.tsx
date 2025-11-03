import styled from 'styled-components';

export interface ButtonProps {
	variant: 'fill' | 'outline' | 'icon';
	href?: string;
}

export var Base = styled.button`
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

	&:hover {
		text-decoration: none;
	}

	// to make the target size a bit larger
	&::after {
		--tap-increment: -5px;
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

	&:disabled {
		opacity: 0.6;
	}
`;

export var FillButton = styled(Base)`
	--bg-color: var(--bg-tertiary);
	--hover-bg-color: var(--bg-tertiary-hover);
	background-color: var(--bg-color);
	@media (hover: hover) {
		&:hover {
			background-color: var(--hover-bg-color);
		}

		&:disabled:hover {
			--hover-bg-color: var(--bg-tertiary);
		}
	}
`;
export var OutlineButton = styled(Base)`
	--hover-bg-color: var(--bg-primary-hover);
	border: 1px solid var(--border);
	@media (hover: hover) {
		&:hover {
			background-color: var(--hover-bg-color);
		}
		&:disabled:hover {
			background-color: unset;
		}
	}
`;

export var IconButton = styled(Base)`
	--hover-bg-color: var(--bg-primary-hover);
	--padding: 6px;
	padding: var(--padding);
	border-radius: 8px;
	@media (hover: hover) {
		&:hover {
			background-color: var(--hover-bg-color);
		}

		&:disabled:hover {
			background-color: unset;
		}
	}
`;
