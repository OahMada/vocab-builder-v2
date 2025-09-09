'use client';

import Button from '@/components/Button';
import Icon from '@/components/Icon';
import VisuallyHidden from '@/components/VisuallyHidden';
import * as React from 'react';
import styled from 'styled-components';
import { postFetcher } from '@/lib';
import useSWRMutation from 'swr/mutation';
import { useAudioDataContext } from '@/components/AudioDataProvider';
import Toast from '@/components/Toast';
import { handleError, base64ToBlob } from '@/utils';
import { usePlayAudio } from '@/hooks';

interface TTSResponse {
	result: string;
}

interface TTSArg {
	sentence: string;
}

var url = '/api/tts';

function SentenceAudio({ isSubmitting, sentence }: { isSubmitting: boolean; sentence: string }) {
	let { error, trigger, reset } = useSWRMutation<TTSResponse, Error, string, TTSArg>(url, postFetcher);
	let { isLocalDataLoading, audioBlob, updateBlob, audioUrl } = useAudioDataContext();
	let { isPlaying, playAudio, stopAudio } = usePlayAudio();

	React.useEffect(() => {
		async function activateTrigger() {
			let data = await trigger({ sentence });
			if (data) {
				let audioBlob = await base64ToBlob(data.result);
				updateBlob(audioBlob);
			}
		}
		if (!isLocalDataLoading && !audioBlob && !audioUrl) {
			activateTrigger();
		}
	}, [audioBlob, audioUrl, isLocalDataLoading, sentence, trigger, updateBlob]);

	React.useEffect(() => {
		if (isSubmitting) {
			stopAudio();
		}
	}, [isSubmitting, stopAudio]);

	async function retryTTS() {
		reset();
		let data = await trigger({ sentence });
		if (data) {
			let audioBlob = await base64ToBlob(data.result);
			updateBlob(audioBlob);
			return audioBlob;
		}
	}

	return (
		<>
			{error ? (
				<RetryButton
					variant='outline'
					onClick={async () => {
						let result = await retryTTS();
						if (result) {
							playAudio(result);
						}
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
				<AudioButton
					variant='outline'
					onClick={() => playAudio((audioUrl || audioBlob) as string | Blob)}
					disabled={(!audioBlob && !audioUrl) || isSubmitting}
				>
					<Icon id='audio' />
					<VisuallyHidden>Play sentence audio</VisuallyHidden>
				</AudioButton>
			)}
			{error && <Toast content={handleError(error)} contentType='error' />}
		</>
	);
}

export default SentenceAudio;

var AudioButton = styled(Button)``;
var RetryButton = styled(Button)``;
var StopPlayButton = styled(Button)``;
