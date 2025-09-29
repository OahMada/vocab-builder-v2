import * as React from 'react';

import { TOAST_ID } from '@/constants';
import { handleError } from '@/utils';

import { useGlobalToastContext } from '@/components/GlobalToastProvider';

export function usePlayAudio() {
	let [currentAudio, setCurrentAudio] = React.useState<null | HTMLAudioElement>(null);
	let [playingId, setPlayingId] = React.useState<string | undefined>(undefined);
	let [loadingId, setLoadingId] = React.useState<string | undefined>(undefined);
	let { addToToast } = useGlobalToastContext();

	let stopAudio = React.useCallback(
		function () {
			if (currentAudio) {
				currentAudio.pause();
				currentAudio.currentTime = 0;
				setCurrentAudio(null);
				setPlayingId(undefined);
			}
		},
		[currentAudio]
	);

	let playAudio = React.useCallback(
		async function (audioSource: Blob | string, sentenceId: string) {
			// stop old one
			if (currentAudio) {
				stopAudio();
			}

			// update audio
			let audioUrl: string;
			if (typeof audioSource === 'string') {
				audioUrl = audioSource;
			} else {
				audioUrl = URL.createObjectURL(audioSource);
			}
			let audio = new Audio(audioUrl);
			setCurrentAudio(audio);
			setLoadingId(sentenceId);
			try {
				await audio.play();
				setPlayingId(sentenceId);
			} catch (error) {
				// hide abort errors
				if ((error as Error).name === 'AbortError') return;
				addToToast({
					id: `${TOAST_ID.AUDIO_PLAYING}${audioUrl}`,
					contentType: 'error',
					content: handleError(error),
				});
				setCurrentAudio(null);
			}
			setLoadingId(undefined);
		},
		[addToToast, currentAudio, stopAudio]
	);

	// update playing state when audio paused or ended
	React.useEffect(() => {
		if (!currentAudio || !playingId) return;

		function handler() {
			setPlayingId(undefined);
			setCurrentAudio(null);
		}

		currentAudio.addEventListener('pause', handler);
		currentAudio.addEventListener('ended', handler);
		return () => {
			if (!currentAudio) return;
			currentAudio.removeEventListener('pause', handler);
			currentAudio.removeEventListener('ended', handler);
		};
	}, [currentAudio, playingId]);

	return { playAudio, stopAudio, playingId, loadingId };
}
