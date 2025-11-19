import * as React from 'react';

import SentenceSubmittingContext from './SentenceSubmittingContext';

export function useSentenceSubmittingContext() {
	let result = React.useContext(SentenceSubmittingContext);
	if (!result) {
		throw new Error('useSentenceSubmittingContext has to be used within <SentenceSubmittingContext.Provider>');
	}
	return result;
}
