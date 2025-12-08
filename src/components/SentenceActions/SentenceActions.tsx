'use client';

import * as React from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { createId } from '@paralleldrive/cuid2';
import { m } from 'motion/react';

import createSentence from '@/app/actions/sentence/createSentence';
import updateSentence from '@/app/actions/sentence/updateSentence';
import getBlobStorageSASToken from '@/app/actions/lib/getBlobStorageSASToken';

import { useKeyboardShortcut, useSentenceData } from '@/hooks';
import { SentenceWithPieces, deleteCookie } from '@/lib';
import { BLOB_CONTAINER_TYPE, COOKIE_KEY, CUSTOM_SPRING, TOAST_ID } from '@/constants';
import { handleError, updateLocalStorage } from '@/utils';
import { SentenceDataType } from '@/types';

import { Button } from '@/components/Button';
import VisuallyHidden from '@/components/VisuallyHidden';
import Icon from '@/components/Icon';
import AskAQuestion from '@/components/AskAQuestion';
import SentenceAudio from '@/components/SentenceAudio';
import Loading from '@/components/Loading';
import { useGlobalToastContext } from '@/components/GlobalToastProvider';
import Tooltip from '@/components/Tooltip';
import { useSentenceSubmittingContext } from '@/components/SentenceSubmittingProvider';

function SentenceActions({ sentence, sentenceId }: { sentence: string; sentenceId?: string }) {
	let { addToToast } = useGlobalToastContext();
	let router = useRouter();
	let [isModalShowing, setIsModalShowing] = React.useState(false);
	let { isSubmitting, startTransition } = useSentenceSubmittingContext();
	let { data: session } = useSession();
	let [shouldStopAudio, setShouldStopAudio] = React.useState(false);
	let [sentenceDataReady, sentenceData] = useSentenceData();
	function dismissModal() {
		setIsModalShowing(false);
	}

	function showModal() {
		setIsModalShowing(true);
	}

	let handleCancel = React.useCallback(
		function () {
			setShouldStopAudio(true);
			if (window.history.length && window.history.length > 1) {
				// you can login and land on one of the sentence page, in this case, you can't simply go back
				router.back();
			} else {
				router.replace('/');
			}
			deleteCookie(COOKIE_KEY);
		},
		[router]
	);

	let handleSubmit = React.useCallback(
		async function () {
			setShouldStopAudio(true);
			startTransition(async () => {
				let result: { error: string } | { data: SentenceWithPieces };
				if (sentenceId) {
					let sentenceUpdateInput = {
						...(sentenceData as SentenceDataType),
						id: sentenceId,
					};
					result = await updateSentence(sentenceUpdateInput);
				} else {
					let audioBlob: Blob | undefined;
					let restSentenceData: SentenceDataType | undefined;

					if ('audioBlob' in sentenceData) {
						({ audioBlob, ...restSentenceData } = sentenceData);
					}
					if (!audioBlob || !restSentenceData) return;

					let sasToken: string, containerName: string, storageAccountName: string;
					// get sasToken
					try {
						({ sasToken, containerName, storageAccountName } = await getBlobStorageSASToken(BLOB_CONTAINER_TYPE.AUDIO));
					} catch (error) {
						let errMsg = handleError(error);
						addToToast({
							contentType: 'error',
							content: errMsg,
							id: TOAST_ID.SAS_TOKEN,
						});
						return;
					}

					// upload
					let blobName = createId() + '.mp3';
					let uploadUrl = `https://${storageAccountName}.blob.core.windows.net/${containerName}/${blobName}?${sasToken}`;
					let updateMetaDataUrl = `https://${storageAccountName}.blob.core.windows.net/${containerName}/${blobName}?comp=metadata&${sasToken}`;

					try {
						let uploadRes = await fetch(uploadUrl, {
							method: 'PUT',
							headers: {
								'x-ms-blob-type': 'BlockBlob',
								'Content-Type': 'audio/mpeg',
							},
							body: audioBlob,
						});
						if (!uploadRes.ok) {
							throw new Error(`Upload audio file failed: ${uploadRes.statusText}`);
						}

						let metaRes = await fetch(updateMetaDataUrl, {
							method: 'PUT',
							headers: {
								'x-ms-meta-userid': session?.user.id as string,
							},
						});
						if (!metaRes.ok) {
							throw new Error(`Audio file metadata update failed: ${metaRes.statusText}`);
						}
					} catch (error) {
						// clean up. for example metadata update failed
						try {
							await fetch(uploadUrl, { method: 'DELETE' });
						} catch (cleanupError) {
							console.error('Trying to delete audio file from blob storage but failed', cleanupError);
						}
						console.error('Failed to upload audio', error);
						addToToast({
							contentType: 'error',
							content: 'Failed to upload audio.',
							id: TOAST_ID.AUDIO_UPLOAD,
						});
						return;
					}
					let audioUrl = `https://${storageAccountName}.blob.core.windows.net/${containerName}/${blobName}`;
					let sentenceCreateInput = {
						...restSentenceData,
						sentence,
						audioUrl,
					};

					result = await createSentence(sentenceCreateInput);
				}

				if ('error' in result) {
					addToToast({ contentType: 'error', id: TOAST_ID.SENTENCE_ACTIONS, content: result.error });
					setShouldStopAudio(false);
					return;
				}
				updateLocalStorage('delete');
				if (sentenceId) {
					addToToast({
						id: TOAST_ID.SENTENCE_ACTIONS,
						contentType: 'notice',
						content: sentence,
						title: 'Sentence Updated',
					});

					if (window.history.length && window.history.length > 1) {
						router.back();
					} else {
						router.replace('/');
					}
				} else {
					addToToast({
						id: TOAST_ID.SENTENCE_ACTIONS,
						contentType: 'notice',
						content: sentence,
						title: 'Sentence Created',
						shouldShowActionBtn: true,
					});
					router.replace('/');
				}
			});
		},
		[addToToast, router, sentence, sentenceData, sentenceId, session?.user.id, startTransition]
	);

	// Option/Alt + A to trigger Ask Anything Dialog, Option/Alt + Enter to submit
	useKeyboardShortcut(['Alt', 'KeyA'], () => {
		if (isModalShowing) {
			dismissModal();
		} else {
			showModal();
		}
	});
	useKeyboardShortcut(['Alt', 'Enter'], handleSubmit);
	useKeyboardShortcut(['Alt', 'KeyX'], handleCancel);

	return (
		<>
			<Wrapper layout={true} transition={CUSTOM_SPRING}>
				<Tooltip tip={'Alt / Option + A'}>
					<HelpButton variant='outline' onClick={showModal} disabled={isSubmitting}>
						<Icon id='help' />
						<VisuallyHidden>Ask Any Questions</VisuallyHidden>
					</HelpButton>
				</Tooltip>
				<SentenceAudio shouldStopAudio={shouldStopAudio} sentence={sentence} />
				<Tooltip tip={'Alt / Option + X'}>
					<CancelButton variant='outline' onClick={handleCancel} disabled={isSubmitting}>
						<Icon id='x' />
						&nbsp;Cancel
					</CancelButton>
				</Tooltip>
				<Tooltip tip={'Alt / Option + Enter'}>
					<DoneButton variant='outline' disabled={!sentenceDataReady || isSubmitting} onClick={handleSubmit}>
						{isSubmitting ? <Loading description='submitting data' /> : <Icon id='enter' />}
						&nbsp;Done
					</DoneButton>
				</Tooltip>
			</Wrapper>
			<AskAQuestion isShowing={isModalShowing} onDismiss={dismissModal} sentence={sentence} />
		</>
	);
}

export default SentenceActions;

var Wrapper = styled(m.div)`
	display: flex;
	gap: 8px;
	width: 100%;
	justify-content: flex-end;
	margin-top: auto;
`;

var CancelButton = styled(Button)`
	--text-color: var(--text-status-warning);
`;

var HelpButton = styled(Button)``;

var DoneButton = styled(Button)``;
