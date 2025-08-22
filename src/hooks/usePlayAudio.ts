import * as React from 'react';

export function usePlayAudio(audioSource: (undefined | Blob) | string) {
	let [isPlaying, setIsPlaying] = React.useState(false);
	let audioEleRef = React.useRef<null | HTMLAudioElement>(null);
	let autoPlayRef = React.useRef(false);

	let playAudio = React.useCallback(function () {
		if (audioEleRef.current) {
			setIsPlaying(true);
			audioEleRef.current.play();
		}
	}, []);

	let stopAudio = React.useCallback(function () {
		if (audioEleRef.current) {
			setIsPlaying(false);
			audioEleRef.current.pause();
			audioEleRef.current.currentTime = 0;
		}
	}, []);

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
