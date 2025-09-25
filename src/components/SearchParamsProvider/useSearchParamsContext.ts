'use client';

import * as React from 'react';

import SearchParamsContext from './SearchParamsContext';

export function useSearchParamsContext() {
	let result = React.useContext(SearchParamsContext);
	if (!result) {
		throw new Error('useSearchParamsContext has to be used within <SearchParamsContext.Provider>');
	}
	return result;
}
