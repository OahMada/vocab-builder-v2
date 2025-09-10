'use client';

import * as React from 'react';

interface SearchParamsContextType {
	search: string;
	updateSearch: (value: string) => void;
	isPending: boolean;
}

var SearchParamsContext = React.createContext<SearchParamsContextType | null>(null);

export default SearchParamsContext;
