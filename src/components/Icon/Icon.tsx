'use client';

import * as React from 'react';
import styled from 'styled-components';
import {
	Clipboard,
	CornerDownRight,
	ArrowRight,
	Edit,
	FileText,
	X,
	Check,
	HelpCircle,
	Loader,
	RefreshCw,
	Search,
	Plus,
	Minus,
	Trash2,
	Info,
	Volume2,
	Upload,
	Download,
	ChevronDown,
	ChevronUp,
	Save,
	Menu,
	Pause,
} from 'react-feather';

var icons = {
	clipboard: Clipboard,
	enter: CornerDownRight,
	forward: ArrowRight,
	edit: Edit,
	note: FileText,
	accept: Check,
	x: X,
	help: HelpCircle,
	load: Loader,
	retry: RefreshCw,
	search: Search,
	plus: Plus,
	minus: Minus,
	delete: Trash2,
	info: Info,
	audio: Volume2,
	upload: Upload,
	export: Download,
	'chevron-down': ChevronDown,
	'chevron-up': ChevronUp,
	save: Save,
	'mobile-menu': Menu,
	stop: Pause,
};

interface IconProps {
	id: keyof typeof icons;
	size?: number;
	strokeWidth?: number;
}

function Icon({ id, size = 18, strokeWidth = 1, ...delegated }: IconProps & React.ComponentProps<'div'>) {
	let Component = icons[id];

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
}

var Wrapper = styled.div`
	width: var(--size);
	height: var(--size);

	& > svg {
		display: block;
		stroke-width: var(--stroke-width);
	}
`;

export default Icon;
