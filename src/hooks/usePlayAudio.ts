import * as React from 'react';

import { TOAST_ID } from '@/constants';
import { handleError } from '@/utils';

import { useGlobalToastContext } from '@/components/GlobalToastProvider';

var currentAudio: HTMLAudioElement | null = null;

export function usePlayAudio() {
	let [isPlaying, setIsPlaying] = React.useState(false);
	let [isAudioLoading, setIsAudioLoading] = React.useState(false);
	let { addToToast } = useGlobalToastContext();

	let stopAudio = React.useCallback(function () {
		if (currentAudio) {
			setIsPlaying(false);
			currentAudio.pause();
			currentAudio.currentTime = 0;
			currentAudio = null;
		}
	}, []);

	let playAudio = React.useCallback(
		async function (audioSource: Blob | string) {
			// stop old one
			if (currentAudio) {
				currentAudio.pause();
				currentAudio.currentTime = 0;
			}

			// update audio
			let audioUrl = '';
			if (typeof audioSource === 'string') {
				audioUrl = audioSource;
			} else {
				audioUrl = URL.createObjectURL(audioSource);
			}
			currentAudio = new Audio(audioUrl);
			setIsAudioLoading(true);
			try {
				await currentAudio.play();
				setIsPlaying(true);
			} catch (error) {
				addToToast({
					id: `${TOAST_ID.AUDIO_PLAYING}${audioUrl}`,
					contentType: 'error',
					content: handleError(error),
				});
				stopAudio();
			}
			setIsAudioLoading(false);
		},
		[addToToast, stopAudio]
	);

	// update playing state when audio paused or ended
	React.useEffect(() => {
		if (!currentAudio || !isPlaying) return;
		function handlePause() {
			setIsPlaying(false);
		}

		function handleEnded() {
			setIsPlaying(false);
			currentAudio = null;
		}

		currentAudio.addEventListener('pause', handlePause);
		currentAudio.addEventListener('ended', handleEnded);
		return () => {
			if (!currentAudio) return;
			currentAudio.removeEventListener('pause', handlePause);
			currentAudio.removeEventListener('ended', handleEnded);
		};
	}, [isPlaying]);

	return { isPlaying, playAudio, stopAudio, isAudioLoading };
}
