'use client';

import VisuallyHidden from '@/components/VisuallyHidden';
import * as React from 'react';
import styled from 'styled-components';
import Icon from '@/components/Icon';
import InputBox from '@/components/InputBox';
import { useDebouncedCallback } from '@tanstack/react-pacer';
import DescriptionText from '@/components/DescriptionText';
import { useNuqsSearchParams } from '@/hooks';

function SearchSentence() {
	let { search, setSearch } = useNuqsSearchParams();
	let [query, setQuery] = React.useState(search);

	function updateQuery(e: React.ChangeEvent<HTMLInputElement>) {
		setQuery(e.target.value);
	}

	function clearInput() {
		setQuery('');
		setSearch('');
	}

	function handleEnterKeydown(e: React.KeyboardEvent<HTMLInputElement>) {
		if (e.key === 'Enter') {
			e.preventDefault();
			setSearch(e.currentTarget.value);
		}
	}

	let onSubmit = useDebouncedCallback(setSearch, { wait: 1000 });

	React.useEffect(() => {
		onSubmit(query);
	}, [query, onSubmit]);

	return (
		<Wrapper style={{ '--icon-size': '18px' } as React.CSSProperties}>
			<InnerWrapper>
				<SearchInput clearInput={clearInput} id='search' value={query} onChange={updateQuery} placeholder='Search' onKeyDown={handleEnterKeydown} />
				<Label htmlFor='search'>
					<VisuallyHidden>search sentence</VisuallyHidden>
					<IconWrapper>
						<Icon id='search' />
					</IconWrapper>
				</Label>
			</InnerWrapper>
			<NoticeText>Type in at least 3 characters to start a search.</NoticeText>
		</Wrapper>
	);
}

export default SearchSentence;

var Wrapper = styled.form`
	--icon-padding: 6px;
	width: 100%;
	display: flex;
	flex-direction: column;
	gap: 8px;
`;

var InnerWrapper = styled.div`
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

var NoticeText = styled(DescriptionText)`
	/* optical alignment */
	margin-left: 4px;
	align-self: flex-start;
	color: var(--text-tertiary);
`;
