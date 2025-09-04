import { useQueryState, parseAsString } from 'nuqs';
import * as React from 'react';

export function useNuqsSearchParams() {
	let [isPending, startTransition] = React.useTransition();

	let [search, setSearch] = useQueryState(
		'search',
		parseAsString.withDefault('').withOptions({
			shallow: false,
			history: 'push',
			startTransition,
		})
	);

	return {
		search,
		setSearch,
		isPending,
	};
}
