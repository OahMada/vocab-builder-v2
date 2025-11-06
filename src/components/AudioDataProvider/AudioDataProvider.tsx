'use client';

import * as React from 'react';

import AudioDataContext from './AudioDataContext';

function AudioDataProvider({ audioUrl, children }: { audioUrl?: string; children: React.ReactNode }) {
	let [blob, setBlob] = React.useState<Blob | undefined>(undefined);

	let updateBlob = React.useCallback(async function (audioBlob: Blob) {
		setBlob(audioBlob);
	}, []);

	let value = React.useMemo(
		() => ({
			audioUrl,
			updateBlob,
			audioBlob: blob,
		}),
		[audioUrl, blob, updateBlob]
	);

	return <AudioDataContext.Provider value={value}>{children}</AudioDataContext.Provider>;
}

export default AudioDataProvider;
