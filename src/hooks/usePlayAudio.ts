import * as React from 'react';

import { TOAST_ID } from '@/constants';
import { handleError } from '@/utils';

import { useGlobalToastContext } from '@/components/GlobalToastProvider';

export function usePlayAudio() {
	let AudioRef = React.useRef<null | HTMLAudioElement>(null);
	let [isPlaying, setIsPlaying] = React.useState(false);
	let [isAudioLoading, setIsAudioLoading] = React.useState(false);
	let { addToToast } = useGlobalToastContext();

	let stopAudio = React.useCallback(function () {
		if (AudioRef.current) {
			setIsPlaying(false);
			AudioRef.current.pause();
			AudioRef.current.currentTime = 0;
			AudioRef.current = null;
		}
	}, []);

	let playAudio = React.useCallback(
		async function (audioSource: Blob | string) {
			// update audio
			let audioUrl = '';
			if (typeof audioSource === 'string') {
				audioUrl = audioSource;
			} else {
				audioUrl = URL.createObjectURL(audioSource);
			}
			AudioRef.current = new Audio(audioUrl);
			setIsAudioLoading(true);
			try {
				await AudioRef.current.play();
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
		if (!AudioRef.current || !isPlaying) return;
		function handlePause() {
			setIsPlaying(false);
		}

		function handleEnded() {
			setIsPlaying(false);
			AudioRef.current = null;
		}

		AudioRef.current.addEventListener('pause', handlePause);
		AudioRef.current.addEventListener('ended', handleEnded);
		return () => {
			if (!AudioRef.current) return;
			AudioRef.current.removeEventListener('pause', handlePause);
			AudioRef.current.removeEventListener('ended', handleEnded);
		};
	}, [isPlaying]);

	return { isPlaying, playAudio, stopAudio, isAudioLoading };
}
