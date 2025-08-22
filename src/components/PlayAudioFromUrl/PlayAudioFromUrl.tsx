'use client';

import * as React from 'react';
import Icon from '@/components/Icon';
import VisuallyHidden from '@/components/VisuallyHidden';
import Button from '@/components/Button';
import { usePlayAudio } from '@/hooks';

function PlayAudioFromUrl({ audioUrl, ...delegated }: { audioUrl: string } & Omit<React.ComponentProps<typeof Button>, 'variant'>) {
	let { isPlaying, playAudio, stopAudio } = usePlayAudio(audioUrl);

	return isPlaying ? (
		<Button onClick={stopAudio} variant='icon' {...delegated}>
			<Icon id='stop' size={16} />
			<VisuallyHidden>stop play audio </VisuallyHidden>
		</Button>
	) : (
		<Button onClick={playAudio} variant='icon' {...delegated}>
			<Icon id='audio' size={16} />
			<VisuallyHidden>Play sentence audio</VisuallyHidden>
		</Button>
	);
}

export default PlayAudioFromUrl;
