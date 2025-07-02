// https://css-tricks.com/the-cleanest-trick-for-autogrowing-textareas/

'use client';

import * as React from 'react';
import styled from 'styled-components';
import UnstyledButton from '@/components/UnstyledButton';
import Icon from '@/components/Icon';
import VisuallyHidden from '@/components/VisuallyHidden';

function TextArea({ ...delegated }) {
	let [input, setInput] = React.useState('');

	return (
		<Wrapper>
			<InputArea as='textarea' {...delegated} value={input} onChange={(e) => setInput(e.target.value)} rows={1} />
			<Overlay aria-hidden='true'>{input + ' '}</Overlay>
			{input && (
				<ClearButton
					onClick={() => {
						setInput('');
					}}
				>
					<Icon id='clear' size={18} />
					<VisuallyHidden>Clear Textarea</VisuallyHidden>
				</ClearButton>
			)}
		</Wrapper>
	);
}

export default TextArea;

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
	border-radius: var(--border-radius);
	resize: none;
	border: none;
	color: inherit;
	background-color: inherit;
	padding-right: 38px;
`;
var Overlay = styled(Base)`
	visibility: hidden;
	white-space: pre-wrap;
`;

var ClearButton = styled(UnstyledButton)`
	position: absolute;
	right: 10px;
	top: 12px;
`;
