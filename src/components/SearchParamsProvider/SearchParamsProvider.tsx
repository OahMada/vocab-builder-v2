'use client';

import * as React from 'react';

import SearchParamsContext from './SearchParamsContext';
import { useNuqsSearchParams } from '@/hooks';

function SearchParamsProvider({ children }: { children: React.ReactNode }) {
	let { search, setSearch, isPending } = useNuqsSearchParams();

	let updateSearch = React.useCallback(
		function (value: string) {
			setSearch(value);
		},
		[setSearch]
	);

	let value = React.useMemo(
		() => ({
			search,
			updateSearch,
			isPending,
		}),
		[isPending, search, updateSearch]
	);

	return <SearchParamsContext.Provider value={value}>{children}</SearchParamsContext.Provider>;
}

export default SearchParamsProvider;
