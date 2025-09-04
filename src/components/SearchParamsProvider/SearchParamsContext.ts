'use client';

import * as React from 'react';

interface SearchParamsContextType {
	search: string;
	updateSearch: (value: string) => void;
	isLoadingSearchResult: boolean;
}

var SearchParamsContext = React.createContext<SearchParamsContextType | null>(null);

export default SearchParamsContext;
