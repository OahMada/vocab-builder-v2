import * as React from 'react';

export function useAudioPlay(audioBlob: undefined | Blob) {
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
		if (!audioBlob) return;
		let audioUrl = URL.createObjectURL(audioBlob);
		audioEleRef.current = new Audio(audioUrl);

		if (autoPlayRef.current) {
			playAudio();
			autoPlayRef.current = false;
		}
	}, [audioBlob, playAudio]);

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
