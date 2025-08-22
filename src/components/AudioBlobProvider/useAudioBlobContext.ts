import * as React from 'react';
import AudioBlobContext from './AudioBlobContext';

export function useAudioBlobContext() {
	let result = React.useContext(AudioBlobContext);
	if (!result) {
		throw new Error('useSentenceAudioContext has to be used within <SentenceAudioContext.Provider>');
	}
	return result;
}
