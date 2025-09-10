'use client';

import VisuallyHidden from '@/components/VisuallyHidden';
import * as React from 'react';
import styled from 'styled-components';
import Icon from '@/components/Icon';
import InputBox from '@/components/InputBox';
import { useDebouncer } from '@tanstack/react-pacer';
import { useSearchParamsContext } from '@/components/SearchParamsProvider';

function SearchSentence() {
	let { search, updateSearch } = useSearchParamsContext();
	let [query, setQuery] = React.useState(search);

	function updateQuery(e: React.ChangeEvent<HTMLInputElement>) {
		setQuery(e.target.value);
	}

	function clearInput() {
		setQuery('');
		updateSearch('');
	}

	// to deal with deleting the last search query character, which persists with the later effect call.
	function handleEnterKeydown(e: React.KeyboardEvent<HTMLInputElement>) {
		if (e.key === 'Backspace' && query.length === 1) {
			updateSearch('');
			updateSearchDebouncer.cancel();
		}
	}

	let updateSearchDebouncer = useDebouncer(updateSearch, { wait: 1000 });
	React.useEffect(() => {
		if (query) {
			updateSearchDebouncer.maybeExecute(query);
		}
	}, [query, updateSearchDebouncer]);

	return (
		<Wrapper style={{ '--icon-size': '18px' } as React.CSSProperties}>
			<SearchInput clearInput={clearInput} id='search' value={query} onChange={updateQuery} placeholder='Search' onKeyDown={handleEnterKeydown} />
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
