'use client';

import Button from '@/components/Button';
import Icon from '@/components/Icon';
import VisuallyHidden from '@/components/VisuallyHidden';
import * as React from 'react';
import styled from 'styled-components';

function InputBox({
	input,
	onChange,
	clearInput,
	id,
	...delegated
}: {
	id: string;
	input: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	clearInput: () => void;
} & React.ComponentProps<'input'>) {
	return (
		<Wrapper style={{ '--icon-size': '18px', '--icon-padding': '6px' } as React.CSSProperties}>
			<Input id={id} value={input} onChange={onChange} {...delegated} />
			{input && (
				<ClearButton variant='icon' onClick={clearInput}>
					<Icon id='x' />
					<VisuallyHidden>clear input</VisuallyHidden>
				</ClearButton>
			)}
		</Wrapper>
	);
}

export default InputBox;

var Wrapper = styled.div`
	position: relative;
	--icon-dimension: calc(var(--icon-size) + 2 * var(--icon-padding));
	color: var(--text-secondary);

	@media (hover: hover) {
		&:hover {
			color: var(--text-primary);
		}
	}
`;

var Input = styled.input`
	--vertical-padding: 10px;
	--horizontal-padding: 12px;

	--bg-color: var(--bg-secondary);
	background-color: var(--bg-color);
	border: 1px solid var(--border-medium);
	border-radius: 12px;
	width: 100%;
	padding: var(--vertical-padding) var(--horizontal-padding);
	padding-right: calc(var(--icon-dimension) + var(--horizontal-padding));
	color: inherit;
`;

var ClearButton = styled(Button)`
	--hover-bg-color: var(--bg-tertiary);
	position: absolute;
	top: 0;
	bottom: 0;
	right: 8px;
	height: var(--icon-dimension);
	margin: auto 0;
`;
