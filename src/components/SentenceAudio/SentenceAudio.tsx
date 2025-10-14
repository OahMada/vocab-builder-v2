'use client';

import * as React from 'react';
import styled from 'styled-components';
import useSWRMutation from 'swr/mutation';
import { useParams } from 'next/navigation';

import { postFetcher } from '@/lib';
import { handleError, base64ToBlob } from '@/utils';
import { usePlayAudio } from '@/hooks';
import { TOAST_ID } from '@/constants';

import Button from '@/components/Button';
import Icon from '@/components/Icon';
import VisuallyHidden from '@/components/VisuallyHidden';
import { useAudioDataContext } from '@/components/AudioDataProvider';
import Loading from '@/components/Loading';
import { useGlobalToastContext } from '@/components/GlobalToastProvider';

interface TTSResponse {
	data: string;
}

interface TTSArg {
	sentence: string;
}

var url = '/api/tts';

function SentenceAudio({ shouldStopAudio, sentence }: { shouldStopAudio: boolean; sentence: string }) {
	let { sentenceId } = useParams<{ sentenceId: string }>();
	let { addToToast } = useGlobalToastContext();
	let { error, trigger, reset } = useSWRMutation<TTSResponse, Error, string, TTSArg>(url, postFetcher, {
		onError: (err) => {
			addToToast({
				id: TOAST_ID.SENTENCE_AUDIO,
				contentType: 'error',
				content: handleError(err),
			});
		},
	});
	let { isLocalDataLoading, audioBlob, updateBlob, audioUrl } = useAudioDataContext();
	let { playingId, playAudio, stopAudio, loadingId } = usePlayAudio();
	let isPlaying = playingId === sentenceId;
	let isLoading = loadingId === sentenceId;

	React.useEffect(() => {
		async function activateTrigger() {
			let result = await trigger({ sentence });
			if (result) {
				let audioBlob = await base64ToBlob(result.data);
				updateBlob(audioBlob);
			}
		}
		if (!isLocalDataLoading && !audioBlob && !audioUrl) {
			activateTrigger();
		}
	}, [audioBlob, audioUrl, isLocalDataLoading, sentence, trigger, updateBlob]);

	React.useEffect(() => {
		if (shouldStopAudio) {
			stopAudio();
		}
	}, [shouldStopAudio, stopAudio]);

	async function retryTTS() {
		reset();
		let result = await trigger({ sentence });
		if (result) {
			let audioBlob = await base64ToBlob(result.data);
			updateBlob(audioBlob);
			return audioBlob;
		}
	}

	return error ? (
		<RetryButton
			variant='outline'
			onClick={async () => {
				let result = await retryTTS();
				if (result) {
					playAudio(result, sentenceId);
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
			onClick={() => playAudio((audioUrl || audioBlob) as string | Blob, sentenceId)}
			disabled={(!audioBlob && !audioUrl) || shouldStopAudio || isLoading}
		>
			{isLoading ? (
				<Loading description='loading audio data' />
			) : (
				<>
					<Icon id='audio' />
					<VisuallyHidden>Play sentence audio</VisuallyHidden>
				</>
			)}
		</AudioButton>
	);
}

export default SentenceAudio;

var AudioButton = styled(Button)``;
var RetryButton = styled(Button)``;
var StopPlayButton = styled(Button)``;
