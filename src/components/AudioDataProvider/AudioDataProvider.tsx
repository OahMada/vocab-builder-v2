'use client';

import * as React from 'react';
import { updateLocalDB } from '@/helpers';
import { useReadLocalDB } from '@/hooks';
import AudioDataContext from './AudioDataContext';

function AudioDataProvider({ audioUrl, children }: { audioUrl: string | undefined; children: React.ReactNode }) {
	let [blob, setBlob] = React.useState<Blob | undefined>(undefined);

	let updateBlob = React.useCallback(async function (audioBlob: Blob) {
		setBlob(audioBlob);
	}, []);

	let isLoading = useReadLocalDB<Blob>(updateBlob);

	React.useEffect(() => {
		if (!blob) return;
		async function saveBlob() {
			try {
				await updateLocalDB('set', blob!);
			} catch (error) {
				console.error('updating indexedDB acton failed', error);
			}
		}
		saveBlob();
	}, [blob]);

	let value = React.useMemo(
		() => ({
			audioUrl,
			isLocalDataLoading: isLoading,
			updateBlob,
			audioBlob: blob,
		}),
		[audioUrl, blob, isLoading, updateBlob]
	);

	return <AudioDataContext.Provider value={value}>{children}</AudioDataContext.Provider>;
}

export default AudioDataProvider;
