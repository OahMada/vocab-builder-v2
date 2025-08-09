'use client';

import * as React from 'react';
import WordsIPAContext from './WordIPAContext';

export function useWordsIPAContext() {
	let result = React.useContext(WordsIPAContext);
	if (!result) {
		throw new Error('useWordsIPAContext has to be used within <WordsIPAContext.Provider>');
	}
	return result;
}
