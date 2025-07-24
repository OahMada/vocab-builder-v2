// https://css-tricks.com/the-cleanest-trick-for-autogrowing-textareas/

'use client';

import * as React from 'react';
import styled from 'styled-components';
import Icon from '@/components/Icon';
import VisuallyHidden from '@/components/VisuallyHidden';
import Button from '@/components/Button';

// TODO restrict the length of the inputted text

function Textarea({ ...delegated }) {
	let [input, setInput] = React.useState('');

	return (
		<Wrapper style={{ '--icon-size': '18px', '--icon-padding': '6px' } as React.CSSProperties}>
			<InputArea as='textarea' {...delegated} value={input} onChange={(e) => setInput(e.target.value)} rows={1} autoFocus={true} />
			<Overlay aria-hidden='true'>{input + ' '}</Overlay>
			{input && (
				<ClearButton
					variant='icon'
					onClick={() => {
						setInput('');
					}}
				>
					<Icon id='x' />
					<VisuallyHidden>Clear Textarea</VisuallyHidden>
				</ClearButton>
			)}
		</Wrapper>
	);
}

export default Textarea;

var Wrapper = styled.div`
	--icon-dimension: calc(var(--icon-size) + var(--icon-padding) * 2);
	--vertical-padding: 10px;
	--horizontal-padding: 12px;
	display: grid;
	border: 1px solid var(--border-medium);
	border-radius: 12px;
	position: relative;
`;

var Base = styled.div`
	padding: var(--vertical-padding) var(--horizontal-padding);
	width: 100%;
	grid-area: 1 / 1 / 2 / 2;
	margin: 0;
`;

var InputArea = styled(Base)`
	padding-right: calc(var(--icon-dimension) + var(--horizontal-padding));
	border-radius: inherit;
	resize: none;
	border: none;
	color: inherit;
	background-color: inherit;

	&::placeholder {
		font-size: 16px;
		line-height: 1.5;
		height: 24px;
		position: absolute;
		top: 0;
		bottom: 0;
		margin: auto;
	}
`;
var Overlay = styled(Base)`
	visibility: hidden;
	white-space: pre-wrap;
`;

var ClearButton = styled(Button)`
	--hover-bg-color: var(--bg-tertiary);
	--icon-dimension: calc(var(--icon-size) + var(--padding) * 2);
	position: absolute;
	/* One line height minus the icon button height, then divide the result by 2. */
	right: calc((1rem * 1.5 + var(--vertical-padding) * 2 - var(--icon-dimension)) / 2);
	top: calc((1rem * 1.5 + var(--vertical-padding) * 2 - var(--icon-dimension)) / 2);
`;
