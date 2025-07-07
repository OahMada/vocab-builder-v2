// https://css-tricks.com/the-cleanest-trick-for-autogrowing-textareas/

'use client';

import * as React from 'react';
import styled from 'styled-components';
import Icon from '@/components/Icon';
import VisuallyHidden from '@/components/VisuallyHidden';
import Button from '@/components/Button';

function Textarea({ ...delegated }) {
	let [input, setInput] = React.useState('');

	return (
		<Wrapper>
			<InputArea as='textarea' {...delegated} value={input} onChange={(e) => setInput(e.target.value)} rows={1} autoFocus={true} />
			<Overlay aria-hidden='true'>{input + ' '}</Overlay>
			{input && (
				<ClearButton
					variant='ghost'
					onClick={() => {
						setInput('');
					}}
					style={{ '--icon-size': '18px' } as React.CSSProperties}
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
	--border-radius: 12px;
	display: grid;
	border: 1px solid var(--border-medium);
	border-radius: var(--border-radius);
	position: relative;
`;

var Base = styled.div`
	font-size: 1rem;
	line-height: 1.5;
	padding: 10px 12px;
	width: 100%;
	grid-area: 1 / 1 / 2 / 2;
	margin: 0;
`;

var InputArea = styled(Base)`
	padding-right: 3rem;
	border-radius: var(--border-radius);
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
	/* color: red; */
	white-space: pre-wrap;
`;

var ClearButton = styled(Button)`
	--padding: 6px;
	--hover-bg-color: var(--bg-tertiary);
	height: calc(var(--icon-size) + var(--padding) * 2);
	position: absolute;
	right: 8px;
	top: 0;
	bottom: 0;
	padding: var(--padding);
	margin: auto;
`;
