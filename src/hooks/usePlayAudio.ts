import { useGlobalToastContext } from '@/components/GlobalToastProvider';
import { TOAST_ID } from '@/constants';
import { handleError } from '@/utils';
import * as React from 'react';

export function usePlayAudio(audioSource: (undefined | Blob) | string) {
	let [isPlaying, setIsPlaying] = React.useState(false);
	let audioEleRef = React.useRef<null | HTMLAudioElement>(null);
	let autoPlayRef = React.useRef(false);
	let { addToToast, removeFromToast } = useGlobalToastContext();

	let stopAudio = React.useCallback(function () {
		if (audioEleRef.current) {
			setIsPlaying(false);
			audioEleRef.current.pause();
			audioEleRef.current.currentTime = 0;
		}
	}, []);

	let playAudio = React.useCallback(
		async function () {
			removeFromToast(TOAST_ID.AUDIO_PLAYING);
			if (audioEleRef.current) {
				setIsPlaying(true);
				try {
					await audioEleRef.current.play();
				} catch (error) {
					addToToast({
						id: TOAST_ID.AUDIO_PLAYING,
						contentType: 'error',
						content: handleError(error),
					});
					stopAudio();
				}
			}
		},
		[addToToast, removeFromToast, stopAudio]
	);

	let enableAutoPlay = React.useCallback(() => {
		autoPlayRef.current = true;
	}, []);

	React.useEffect(() => {
		let audioELe: HTMLAudioElement;
		if (typeof audioSource === 'string') {
			audioELe = new Audio(audioSource);
		} else {
			if (!audioSource) return;
			let audioUrl = URL.createObjectURL(audioSource);
			audioELe = new Audio(audioUrl);
		}
		audioEleRef.current = audioELe;

		if (autoPlayRef.current) {
			playAudio();
			autoPlayRef.current = false;
		}
	}, [audioSource, playAudio]);

	React.useEffect(() => {
		if (!audioEleRef.current || !isPlaying) return;
		function handleEnded() {
			setIsPlaying(false);
		}
		audioEleRef.current.addEventListener('ended', handleEnded);
		return () => {
			if (!audioEleRef.current) return;
			audioEleRef.current.removeEventListener('ended', handleEnded);
		};
	}, [isPlaying]);

	return { isPlaying, playAudio, stopAudio, enableAutoPlay };
}
