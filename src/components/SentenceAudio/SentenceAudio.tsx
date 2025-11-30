'use client';

import * as React from 'react';
import styled from 'styled-components';
import useSWRMutation from 'swr/mutation';
import { useParams } from 'next/navigation';

import { postFetcher } from '@/helpers';
import { handleError, base64ToBlob } from '@/utils';
import { usePlayAudio } from '@/hooks';
import { TOAST_ID } from '@/constants';

import { Button } from '@/components/Button';
import Icon from '@/components/Icon';
import VisuallyHidden from '@/components/VisuallyHidden';
import { useAudioDataContext } from '@/components/AudioDataProvider';
import Loading from '@/components/Loading';
import { useGlobalToastContext } from '@/components/GlobalToastProvider';
import Tooltip from '@/components/Tooltip';

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
	let { audioBlob, updateBlob, audioUrl } = useAudioDataContext();
	let { playingId, playAudio, stopAudio, loadingId } = usePlayAudio();
	let isPlaying = playingId === sentenceId;
	let isLoading = loadingId === sentenceId;

	// fetch audio
	React.useEffect(() => {
		async function activateTrigger() {
			let result = await trigger({ sentence });
			if (result) {
				let audioBlob = await base64ToBlob(result.data);
				updateBlob(audioBlob);
			}
		}
		if (!audioBlob && !audioUrl) {
			activateTrigger();
		}
	}, [audioBlob, audioUrl, sentence, trigger, updateBlob]);

	React.useEffect(() => {
		if (shouldStopAudio) {
			stopAudio();
		}
	}, [shouldStopAudio, stopAudio]);

	let handleRetryTTS = React.useCallback(
		async function () {
			reset();
			let result = await trigger({ sentence });
			if (result) {
				let audioBlob = await base64ToBlob(result.data);
				updateBlob(audioBlob);
				playAudio(audioBlob, sentenceId);
			}
		},
		[playAudio, reset, sentence, sentenceId, trigger, updateBlob]
	);

	let handlePlayAudio = React.useCallback(
		function () {
			playAudio((audioUrl || audioBlob) as string | Blob, sentenceId);
		},
		[audioBlob, audioUrl, playAudio, sentenceId]
	);

	let handleStopAudio = React.useCallback(
		function () {
			stopAudio();
		},
		[stopAudio]
	);

	// Cmd/Ctrl + Shift + P to trigger audio
	React.useEffect(() => {
		async function handleKeyDown(e: KeyboardEvent) {
			if (e.altKey && e.code === 'KeyP') {
				e.preventDefault();
				if (error) {
					await handleRetryTTS();
					return;
				}
				if (isPlaying) {
					handleStopAudio();
					return;
				}
				handlePlayAudio();
			}
		}
		document.addEventListener('keydown', handleKeyDown);
		return () => {
			document.removeEventListener('keydown', handleKeyDown);
		};
	}, [error, handlePlayAudio, handleRetryTTS, handleStopAudio, isPlaying]);

	return (
		<Tooltip tip={'Alt / Option + P'}>
			{error ? (
				<RetryButton variant='outline' onClick={handleRetryTTS}>
					<Icon id='refresh' />
					<VisuallyHidden>Retry generating speech</VisuallyHidden>
				</RetryButton>
			) : isPlaying ? (
				<StopPlayButton variant='outline' onClick={handleStopAudio}>
					<Icon id='stop' />
					<VisuallyHidden>stop play audio </VisuallyHidden>
				</StopPlayButton>
			) : (
				<AudioButton variant='outline' onClick={handlePlayAudio} disabled={(!audioBlob && !audioUrl) || shouldStopAudio || isLoading}>
					{isLoading ? (
						<Loading description='loading audio data' />
					) : (
						<>
							<Icon id='audio' />
							<VisuallyHidden>Play sentence audio</VisuallyHidden>
						</>
					)}
				</AudioButton>
			)}
		</Tooltip>
	);
}

export default SentenceAudio;

var AudioButton = styled(Button)``;
var RetryButton = styled(Button)``;
var StopPlayButton = styled(Button)``;
