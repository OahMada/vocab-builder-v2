import { useGlobalToastContext } from '@/components/GlobalToastProvider';
import { handleError } from '@/utils';
import * as React from 'react';

export function usePlayAudio(audioSource: (undefined | Blob) | string) {
	let [isPlaying, setIsPlaying] = React.useState(false);
	let audioEleRef = React.useRef<null | HTMLAudioElement>(null);
	let autoPlayRef = React.useRef(false);
	// let [error, setError] = React.useState<string | undefined>(undefined);
	let { addToToast, resetToast } = useGlobalToastContext();

	let stopAudio = React.useCallback(function () {
		if (audioEleRef.current) {
			setIsPlaying(false);
			audioEleRef.current.pause();
			audioEleRef.current.currentTime = 0;
		}
	}, []);

	let playAudio = React.useCallback(
		async function () {
			resetToast('audio');
			if (audioEleRef.current) {
				setIsPlaying(true);
				try {
					await audioEleRef.current.play();
				} catch (error) {
					// setError(handleError(error));
					addToToast({
						id: 'audio',
						contentType: 'error',
						content: handleError(error),
					});
					stopAudio();
				}
			}
		},
		[addToToast, resetToast, stopAudio]
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
