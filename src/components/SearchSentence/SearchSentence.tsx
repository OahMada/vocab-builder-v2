'use client';

import * as React from 'react';
import styled from 'styled-components';
import { useDebouncedCallback } from '@tanstack/react-pacer';
import { withErrorBoundary, FallbackProps } from 'react-error-boundary';

import { handleError } from '@/utils';

import VisuallyHidden from '@/components/VisuallyHidden';
import Icon from '@/components/Icon';
import InputBox from '@/components/InputBox';
import { useSearchParamsContext } from '@/components/SearchParamsProvider';
import { ErrorText, ErrorTitle } from '@/components/ErrorDisplay';

function SearchSentence() {
	let { search, updateSearch } = useSearchParamsContext();
	let [query, setQuery] = React.useState(search);

	let submitSearch = useDebouncedCallback(
		(query: string) => {
			updateSearch(query);

			// reset scroll when entering search mode
			if (!search) {
				window.scrollTo(0, 0);
			}
		},
		{ wait: 1000 }
	);

	function updateQuery(e: React.ChangeEvent<HTMLInputElement>) {
		let value = e.target.value;
		setQuery(value);
		submitSearch(value);
	}

	function clearInput() {
		setQuery('');
		updateSearch('');
	}

	return (
		<Wrapper style={{ '--icon-size': '18px' } as React.CSSProperties}>
			<SearchInput clearInput={clearInput} id='search' value={query} onChange={updateQuery} placeholder='Search' />
			<Label htmlFor='search'>
				<VisuallyHidden>search sentence</VisuallyHidden>
				<IconWrapper>
					<Icon id='search' />
				</IconWrapper>
			</Label>
		</Wrapper>
	);
}

var SearchSentenceWithErrorBoundary = withErrorBoundary(SearchSentence, {
	FallbackComponent: Fallback,
});

export default SearchSentenceWithErrorBoundary;

function Fallback({ error }: FallbackProps) {
	let errorMsg = handleError(error);
	return (
		<ErrorWrapper>
			<ErrorTitle>An Error Occurred</ErrorTitle>
			<ErrorText>{errorMsg}</ErrorText>
		</ErrorWrapper>
	);
}

var Wrapper = styled.div`
	--icon-padding: 6px;
	width: 100%;
	position: relative;
`;

var Label = styled.label``;

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

var ErrorWrapper = styled.div`
	display: flex;
	flex-direction: column;
	align-items: flex-start;
`;
