'use client';

import * as React from 'react';

import GlobalToastContext from './GlobalToastContext';

export function useGlobalToastContext() {
	let result = React.useContext(GlobalToastContext);
	if (!result) {
		throw new Error('useGlobalToastContext has to be used within <GlobalToastContext.Provider>');
	}
	return result;
}
