import 'server-only';

import { createSearchParamsCache, parseAsString } from 'nuqs/server';

var searchParamsCache = createSearchParamsCache({
	search: parseAsString.withDefault(''),
});
export default searchParamsCache;
