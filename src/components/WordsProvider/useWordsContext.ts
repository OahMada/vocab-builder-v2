'use client';

import * as React from 'react';
import WordsContext from './WordContext';

export function useWordsContext() {
	let result = React.useContext(WordsContext);
	if (!result) {
		throw new Error('useWordsIPAContext has to be used within <WordsIPAContext.Provider>');
	}
	return result;
}
