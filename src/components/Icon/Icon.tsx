'use client';

import * as React from 'react';
import styled from 'styled-components';
import { Clipboard, CornerDownRight, XCircle, ArrowRight, Edit, FileText, X, Check, HelpCircle } from 'react-feather';

const icons = {
	clipboard: Clipboard,
	enter: CornerDownRight,
	clear: XCircle,
	forward: ArrowRight,
	edit: Edit,
	note: FileText,
	accept: Check,
	cancel: X,
	help: HelpCircle,
};

interface IconProps {
	id: keyof typeof icons;
	size: number;
	strokeWidth?: number;
}

const Icon = ({ id, size, strokeWidth = 1, ...delegated }: IconProps & React.ComponentProps<'div'>) => {
	const Component = icons[id];

	if (!Component) {
		throw new Error(`No icon found for ID: ${id}`);
	}

	return (
		<Wrapper
			style={
				{
					'--size': size + 'px',
					'--stroke-width': strokeWidth + 'px',
				} as React.CSSProperties
			}
			{...delegated}
		>
			<Component color='currentColor' size={size} />
		</Wrapper>
	);
};

const Wrapper = styled.div`
	width: var(--size);
	height: var(--size);

	& > svg {
		display: block;
		stroke-width: var(--stroke-width);
	}
`;

export default Icon;
