import { useQueryState, parseAsString } from 'nuqs';
import { INPUT_NAME } from '@/constants';

export function useNuqsSearchParams() {
	let [search, setSearch] = useQueryState(
		INPUT_NAME.SEARCH,
		parseAsString.withDefault('').withOptions({
			shallow: false,
			history: 'push',
		})
	);

	return {
		search,
		setSearch,
	};
}
