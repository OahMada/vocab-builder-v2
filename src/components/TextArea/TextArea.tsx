// https://css-tricks.com/the-cleanest-trick-for-autogrowing-textareas/

'use client';

import * as React from 'react';
import styled from 'styled-components';
import Icon from '@/components/Icon';
import VisuallyHidden from '@/components/VisuallyHidden';
import Button from '@/components/Button';

interface TextAreaProps {
	clearInput: () => void;
	value: string;
}

function TextArea({ value, clearInput, ...delegated }: TextAreaProps & React.ComponentProps<'textarea'>) {
	return (
		<Wrapper style={{ '--icon-size': '18px', '--icon-padding': '6px' } as React.CSSProperties}>
			<InputArea as='textarea' {...delegated} rows={1} />
			<Overlay aria-hidden='true'>{value + ' '}</Overlay>
			{value && (
				<ClearButton variant='icon' onClick={clearInput}>
					<Icon id='x' />
					<VisuallyHidden>Clear Textarea</VisuallyHidden>
				</ClearButton>
			)}
		</Wrapper>
	);
}

export default TextArea;

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
	padding-right: calc(var(--icon-dimension) + var(--horizontal-padding));
	width: 100%;
	grid-area: 1 / 1 / 2 / 2;
	margin: 0;
`;

var InputArea = styled(Base)`
	border-radius: inherit;
	resize: none;
	border: none;
	color: inherit;
	background-color: inherit;
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
