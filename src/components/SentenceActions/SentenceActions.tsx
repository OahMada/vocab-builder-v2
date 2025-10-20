'use client';

import * as React from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { createId } from '@paralleldrive/cuid2';
import axios from 'axios';

import createSentence from '@/app/actions/sentence/createSentence';
import updateSentence from '@/app/actions/sentence/updateSentence';
import getBlobStorageSASToken from '@/app/actions/lib/getBlobStorageSASToken';

import { useSentenceData } from '@/hooks';
import { SentenceWithPieces, deleteCookie } from '@/lib';
import { BLOB_CONTAINER_TYPE, COOKIE_KEY, TOAST_ID } from '@/constants';
import { handleError, deleteLocalData } from '@/utils';
import { SentenceDataType } from '@/types';

import Button from '@/components/Button';
import VisuallyHidden from '@/components/VisuallyHidden';
import Icon from '@/components/Icon';
import AskAQuestion from '@/components/AskAQuestion';
import SentenceAudio from '@/components/SentenceAudio';
import Loading from '@/components/Loading';
import { useGlobalToastContext } from '@/components/GlobalToastProvider';
import Tooltip from '@/components/Tooltip';

function SentenceActions({ sentence, sentenceId }: { sentence: string; sentenceId?: string }) {
	let { addToToast } = useGlobalToastContext();
	let router = useRouter();
	let [isModalShowing, setIsModalShowing] = React.useState(false);
	let [isLoading, startTransition] = React.useTransition();
	let { data: session } = useSession();
	let [shouldStopAudio, setShouldStopAudio] = React.useState(false);

	let [sentenceDataReady, sentenceData] = useSentenceData();
	function dismissModal() {
		setIsModalShowing(false);
	}

	function showModal() {
		setIsModalShowing(true);
	}

	function handleCancel() {
		setShouldStopAudio(true);
		if (window.history.length && window.history.length > 1) {
			// you can login and land on one of the sentence page, in this case, you can't simply go back
			router.back();
		} else {
			router.replace('/');
		}

		if (sentenceId) {
			deleteLocalData(true);
		} else {
			deleteLocalData();
		}

		deleteCookie(COOKIE_KEY);
	}

	async function handleSubmit() {
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
					await axios.put(uploadUrl, audioBlob!, {
						headers: {
							'x-ms-blob-type': 'BlockBlob',
							'Content-Type': 'audio/mpeg',
						},
					});

					await axios.put(
						updateMetaDataUrl,
						null, // no body needed
						{
							headers: {
								'x-ms-meta-userid': session?.user.id,
							},
						}
					);
				} catch (error) {
					// clean up. for example metadata update failed
					try {
						await axios.delete(uploadUrl);
					} catch (error) {
						console.error('trying to delete from blob storage but failed', error);
					}
					let errMsg = handleError(error);
					addToToast({
						contentType: 'error',
						content: errMsg,
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
			deleteLocalData(true);
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
				});
				router.replace('/');
			}
		});
	}

	// Cmd/Ctrl + Shift + A to trigger Ask Anything Dialog
	React.useEffect(() => {
		async function handleKeyDown(e: KeyboardEvent) {
			if (e.ctrlKey && e.shiftKey && e.key === 'A') {
				if (isModalShowing) {
					dismissModal();
				} else {
					showModal();
				}
			}
		}
		document.addEventListener('keydown', handleKeyDown);
		return () => {
			document.removeEventListener('keydown', handleKeyDown);
		};
	}, [isModalShowing]);

	return (
		<>
			<Wrapper>
				<Tooltip tip={'Ctrl + Shift + A'}>
					<HelpButton variant='outline' onClick={showModal} disabled={isLoading}>
						<Icon id='help' />
						<VisuallyHidden>Ask Any Questions</VisuallyHidden>
					</HelpButton>
				</Tooltip>
				<SentenceAudio shouldStopAudio={shouldStopAudio} sentence={sentence} />
				<CancelButton variant='outline' onClick={handleCancel} disabled={isLoading}>
					<Icon id='x' />
					&nbsp;Cancel
				</CancelButton>
				<DoneButton variant='outline' disabled={!sentenceDataReady || isLoading} onClick={handleSubmit}>
					{isLoading ? <Loading description='submitting data' /> : <Icon id='enter' />}
					&nbsp;Done
				</DoneButton>
			</Wrapper>
			{isModalShowing && <AskAQuestion isShowing={isModalShowing} onDismiss={dismissModal} sentence={sentence} />}
		</>
	);
}

export default SentenceActions;

var Wrapper = styled.div`
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
