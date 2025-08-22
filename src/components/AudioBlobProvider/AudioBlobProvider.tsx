'use client';

import * as React from 'react';
import { updateLocalDB } from '@/helpers';
import { useReadLocalDB } from '@/hooks';
import AudioBlobContext from './AudioBlobContext';

function AudioBlobProvider({ children }: { children: React.ReactNode }) {
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
			isLocalDataLoading: isLoading,
			updateBlob,
			audioBlob: blob,
		}),
		[blob, isLoading, updateBlob]
	);

	return <AudioBlobContext.Provider value={value}>{children}</AudioBlobContext.Provider>;
}

export default AudioBlobProvider;
