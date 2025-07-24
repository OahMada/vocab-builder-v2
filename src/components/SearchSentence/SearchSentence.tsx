'use client';

import VisuallyHidden from '@/components/VisuallyHidden';
import * as React from 'react';
import styled from 'styled-components';
import Icon from '@/components/Icon';
import InputBox from '@/components/InputBox';

function SearchSentence() {
	let [input, setInput] = React.useState('');

	function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
		setInput(e.target.value);
	}

	function clearInput() {
		setInput('');
	}

	return (
		<Wrapper style={{ '--icon-size': '18px' } as React.CSSProperties}>
			<SearchInput input={input} onChange={onInputChange} clearInput={clearInput} id='search' />
			<Label htmlFor='search'>
				<VisuallyHidden>search sentence</VisuallyHidden>
				<IconWrapper>
					<Icon id='search' />
				</IconWrapper>
			</Label>
		</Wrapper>
	);
}

export default SearchSentence;

var Wrapper = styled.form`
	--icon-padding: 6px;
	width: 100%;
	position: relative;
`;

var Label = styled.label`
	color: var(--text-primary);
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

var SearchInput = styled(InputBox)`
	padding-left: calc(var(--icon-size) + 2 * var(--icon-padding));
`;
