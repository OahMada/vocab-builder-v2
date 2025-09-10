import { useQueryState, parseAsString } from 'nuqs';
import { INPUT_NAME } from '@/constants';
import * as React from 'react';

export function useNuqsSearchParams() {
	let [isPending, startTransition] = React.useTransition();
	let [search, setSearch] = useQueryState(
		INPUT_NAME.SEARCH,
		parseAsString.withDefault('').withOptions({
			shallow: false,
			history: 'push',
			startTransition,
		})
	);

	return {
		isPending,
		search,
		setSearch,
	};
}
