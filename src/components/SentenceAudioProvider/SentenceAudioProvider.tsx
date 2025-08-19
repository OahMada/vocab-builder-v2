'use client';

import * as React from 'react';
import { updateLocalDB } from '@/helpers';
import { useReadLocalDB } from '@/hooks';
import SentenceAudioContext from './SentenceAudioContext';

function SentenceAudioProvider({ children }: { children: React.ReactNode }) {
	let [blob, setBlob] = React.useState<Blob | null>(null);

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
				console.log('updating indexedDB acton failed', error);
			}
		}
		saveBlob();
	}, [blob]);

	let value = React.useMemo(
		() => ({
			isLocalDataLoading: isLoading,
			updateBlob,
			blob,
		}),
		[blob, isLoading, updateBlob]
	);

	return <SentenceAudioContext.Provider value={value}>{children}</SentenceAudioContext.Provider>;
}

export default SentenceAudioProvider;
