'use client';

import VisuallyHidden from '@/components/VisuallyHidden';
import * as React from 'react';
import styled from 'styled-components';
import Icon from '@/components/Icon';
import InputBox from '@/components/InputBox';
import { useDebouncedCallback } from '@tanstack/react-pacer';
import { useForm } from 'react-hook-form';
import { SearchType, SearchSchema } from '@/lib';
import { zodResolver } from '@hookform/resolvers/zod';
import { INPUT_NAME } from '@/constants';
import { useSearchParamsContext } from '@/components/SearchParamsProvider';
import DescriptionText from '@/components/DescriptionText';

function SearchSentence() {
	let { search, updateSearch } = useSearchParamsContext();

	// used for filtering out short search params that are shorter than 3 characters
	let { watch, setValue, register, handleSubmit } = useForm<SearchType>({
		resolver: zodResolver(SearchSchema),
		reValidateMode: 'onSubmit',
		defaultValues: {
			search: '',
		},
		values: {
			search: search,
		},
	});

	function clearInput() {
		setValue(INPUT_NAME.SEARCH, '');
		updateSearch('');
	}

	let searchValue = watch(INPUT_NAME.SEARCH);

	function onSubmit(data: SearchType) {
		updateSearch(data.search);
	}
	function onError() {
		if (search) {
			updateSearch('');
		}
	}
	let submitHandler = useDebouncedCallback(handleSubmit(onSubmit, onError), { wait: 1000 });

	React.useEffect(() => {
		submitHandler();
	}, [searchValue, submitHandler]);

	return (
		<Wrapper style={{ '--icon-size': '18px' } as React.CSSProperties}>
			<InnerWrapper>
				<SearchInput clearInput={clearInput} id='search' {...register(INPUT_NAME.SEARCH)} value={searchValue} placeholder='Search' />
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
