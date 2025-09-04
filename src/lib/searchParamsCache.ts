import 'server-only';

import { createSearchParamsCache, parseAsString } from 'nuqs/server';

export var searchParamsCache = createSearchParamsCache({
	search: parseAsString.withDefault(''),
});
