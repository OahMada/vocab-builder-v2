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
	ChevronDown,
	ChevronUp,
	Save,
	Menu,
	Pause,
	Globe,
	Link,
	Play,
	Sun,
	Moon,
	CloudCog,
	ArrowUp,
	Copy,
	ExternalLink,
	Undo2,
	UserPen,
} from 'lucide-react';

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
	refresh: RefreshCw,
	search: Search,
	plus: Plus,
	minus: Minus,
	delete: Trash2,
	info: Info,
	audio: Volume2,
	upload: Upload,
	'chevron-down': ChevronDown,
	'chevron-up': ChevronUp,
	save: Save,
	'mobile-menu': Menu,
	stop: Pause,
	globe: Globe,
	link: Link,
	play: Play,
	dark: Moon,
	light: Sun,
	sync: CloudCog,
	upward: ArrowUp,
	copy: Copy,
	'external-link': ExternalLink,
	undo: Undo2,
	change: UserPen,
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
