'use client';

import * as React from 'react';
import SentencePiecesContext from './SentencePiecesContext';

export function useSentencePiecesContext() {
	let result = React.useContext(SentencePiecesContext);
	if (!result) {
		throw new Error('useSentencePiecesContext has to be used within <SentencePiecesContext.Provider>');
	}
	return result;
}
