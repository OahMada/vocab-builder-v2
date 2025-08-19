import * as React from 'react';
import SentenceAudioContext from './SentenceAudioContext';

export function useSentenceAudioContext() {
	let result = React.useContext(SentenceAudioContext);
	if (!result) {
		throw new Error('useSentenceAudioContext has to be used within <SentenceAudioContext.Provider>');
	}
	return result;
}
