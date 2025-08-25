'use client';

import Button from '@/components/Button';
import Icon from '@/components/Icon';
import VisuallyHidden from '@/components/VisuallyHidden';
import * as React from 'react';
import styled from 'styled-components';
import { postFetcher } from '@/lib';
import useSWRMutation from 'swr/mutation';
import { useAudioBlobContext } from '@/components/AudioBlobProvider';
import Toast from '@/components/Toast';
import { handleError, base64ToBlob } from '@/utils';
import { usePlayAudio } from '@/hooks';

interface TTSResponse {
	result: string;
}

var url = '/api/tts';

function SentenceAudio({ isSubmitting }: { isSubmitting: boolean }) {
	let { error, trigger, reset } = useSWRMutation<TTSResponse, Error, string, void>(url, postFetcher);
	let { isLocalDataLoading, audioBlob, updateBlob } = useAudioBlobContext();
	let { isPlaying, playAudio, stopAudio, enableAutoPlay } = usePlayAudio(audioBlob);

	React.useEffect(() => {
		async function activateTrigger() {
			let data = await trigger();
			if (data) {
				let audioBlob = await base64ToBlob(data.result);
				updateBlob(audioBlob);
			}
		}
		if (!isLocalDataLoading && !audioBlob) {
			activateTrigger();
		}
	}, [audioBlob, isLocalDataLoading, trigger, updateBlob]);

	React.useEffect(() => {
		if (isSubmitting) {
			stopAudio();
		}
	}, [isSubmitting, stopAudio]);

	async function retryTTS() {
		reset();
		let data = await trigger();
		if (data) {
			let audioBlob = await base64ToBlob(data.result);
			updateBlob(audioBlob);
		}
	}

	return (
		<>
			{error ? (
				<RetryButton
					variant='outline'
					onClick={async () => {
						await retryTTS();
						enableAutoPlay();
					}}
				>
					<Icon id='retry' />
					<VisuallyHidden>Retry generating speech</VisuallyHidden>
				</RetryButton>
			) : isPlaying ? (
				<StopPlayButton variant='outline' onClick={stopAudio}>
					<Icon id='stop' />
					<VisuallyHidden>stop play audio </VisuallyHidden>
				</StopPlayButton>
			) : (
				<AudioButton variant='outline' onClick={playAudio} disabled={!audioBlob || isSubmitting}>
					<Icon id='audio' />
					<VisuallyHidden>Play sentence audio</VisuallyHidden>
				</AudioButton>
			)}
			{error && <Toast content={handleError(error)} />}
		</>
	);
}

export default SentenceAudio;

var AudioButton = styled(Button)``;
var RetryButton = styled(Button)``;
var StopPlayButton = styled(Button)``;
