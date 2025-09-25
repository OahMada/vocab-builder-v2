'use client';

import * as React from 'react';

import Icon from '@/components/Icon';
import VisuallyHidden from '@/components/VisuallyHidden';
import Button from '@/components/Button';
import Loading from '@/components/Loading';

function PlayAudioFromUrl({
	isPlaying,
	playAudio,
	stopAudio,
	isAudioLoading,
	...delegated
}: { isPlaying: boolean; playAudio: () => void; stopAudio: () => void; isAudioLoading: boolean } & Omit<
	React.ComponentProps<typeof Button>,
	'variant'
>) {
	return isPlaying ? (
		<Button onClick={stopAudio} variant='icon' {...delegated}>
			<Icon id='stop' size={16} />
			<VisuallyHidden>stop play audio </VisuallyHidden>
		</Button>
	) : (
		<Button onClick={playAudio} variant='icon' {...delegated}>
			{isAudioLoading ? (
				<Loading description='loading audio data' />
			) : (
				<>
					<Icon id='audio' size={16} />
					<VisuallyHidden>Play sentence audio</VisuallyHidden>
				</>
			)}
		</Button>
	);
}

export default PlayAudioFromUrl;
