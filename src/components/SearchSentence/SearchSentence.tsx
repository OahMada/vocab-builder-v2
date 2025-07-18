'use client';

import VisuallyHidden from '@/components/VisuallyHidden';
import * as React from 'react';
import styled from 'styled-components';
import Button from '@/components/Button';
import Icon from '@/components/Icon';

function SearchSentence() {
	let [input, setInput] = React.useState('');

	return (
		<Wrapper>
			<VisuallyHidden>search sentence</VisuallyHidden>
			<label htmlFor='search'>
				<IconWrapper>
					<Icon id='search' />
				</IconWrapper>
			</label>
			<SearchBox id='search' value={input} onChange={(e) => setInput(e.target.value)} />
			{input && (
				<ClearButton variant='ghost' onClick={() => setInput('')}>
					<Icon id='x' />
					<VisuallyHidden>clear input</VisuallyHidden>
				</ClearButton>
			)}
		</Wrapper>
	);
}

export default SearchSentence;

var Wrapper = styled.form`
	--icon-size: 18px;
	--icon-padding: 6px;
	--icon-dimension: calc(var(--icon-size) + 2 * var(--icon-padding));
	--border-radius: 12px;
	width: 100%;
	color: var(--text-secondary);
	position: relative;

	@media (hover: hover) {
		&:hover {
			color: var(--text-primary);
		}
	}
`;

var SearchBox = styled.input`
	background-color: var(--bg-secondary);
	border: 1px solid var(--border-medium);
	border-radius: 12px;
	width: 100%;
	padding: 10px 0;
	padding-left: var(--icon-dimension);
	padding-right: var(--icon-dimension);
	color: inherit;
`;

var IconWrapper = styled.div`
	position: absolute;
	top: 0;
	bottom: 0;
	height: calc(var(--icon-size) + 2 * var(--icon-padding));
	margin: auto 0;
	padding: var(--icon-padding);
	transform: translateX(2px);
`;

var ClearButton = styled(Button)`
	--hover-bg-color: var(--bg-tertiary);
	position: absolute;
	top: 0;
	bottom: 0;
	right: var(--icon-padding);
	height: var(--icon-dimension);
	margin: auto 0;
`;
