import * as React from 'react';

import AudioDataContext from './AudioDataContext';

export function useAudioDataContext() {
	let result = React.useContext(AudioDataContext);
	if (!result) {
		throw new Error('useAudioDataContext has to be used within <AudioDataContext.Provider>');
	}
	return result;
}
