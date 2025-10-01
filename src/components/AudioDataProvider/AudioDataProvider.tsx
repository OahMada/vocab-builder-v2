'use client';

import * as React from 'react';

import { updateLocalDB, updateLocalStorage } from '@/helpers';
import { useReadLocalDB, useReadLocalStorage } from '@/hooks';
import AudioDataContext from './AudioDataContext';
import { LOCAL_STORAGE_KEY } from '@/constants';

function AudioDataProvider({ audioUrl, children }: { audioUrl?: string; children: React.ReactNode }) {
	let [blob, setBlob] = React.useState<Blob | undefined>(undefined);
	let [audioHash, setAudioHash] = React.useState<undefined | string>(undefined);

	let updateBlob = React.useCallback(async function (audioBlob: Blob) {
		setBlob(audioBlob);
	}, []);

	let updateHash = React.useCallback(async function (hash: string) {
		setAudioHash(hash);
	}, []);

	let isBlobLoading = useReadLocalDB<Blob>(updateBlob);
	let isHashLoading = useReadLocalStorage<string>(LOCAL_STORAGE_KEY.AUDIO_HASH, updateHash);

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

	React.useEffect(() => {
		if (audioHash) {
			updateLocalStorage<string>('save', LOCAL_STORAGE_KEY.AUDIO_HASH, audioHash);
		}
	}, [audioHash]);

	let value = React.useMemo(
		() => ({
			audioHash,
			audioUrl,
			isLocalDataLoading: isBlobLoading || isHashLoading,
			updateBlob,
			audioBlob: blob,
			updateHash,
		}),
		[audioHash, audioUrl, blob, isBlobLoading, isHashLoading, updateBlob, updateHash]
	);

	return <AudioDataContext.Provider value={value}>{children}</AudioDataContext.Provider>;
}

export default AudioDataProvider;
