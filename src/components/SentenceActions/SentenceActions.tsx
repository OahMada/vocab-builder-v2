'use client';

import * as React from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';
import Button from '@/components/Button';
import VisuallyHidden from '@/components/VisuallyHidden';
import Icon from '@/components/Icon';
import AskAQuestion from '@/components/AskAQuestion';
import SentenceAudio from '@/components/SentenceAudio';
import createSentence from '@/app/actions/sentence/createSentence';
import { deleteLocalData } from '@/helpers/deleteLocalData';
import Loading from '@/components/Loading';
import { useSentenceData } from '@/hooks';
import { handleError } from '@/utils';
import { Toast } from '@/components/Toast';
import { SentenceCreateInputType, SentenceUpdateInputType, SentenceWithPieces } from '@/lib';
import updateSentence from '@/app/actions/sentence/updateSentence';
import { useGlobalToastContext } from '@/components/GlobalToastProvider';
import { TOAST_ID } from '@/constants';

function SentenceActions({ sentence, sentenceId }: { sentence: string; sentenceId?: string }) {
	let { addToToast, removeFromToast } = useGlobalToastContext();
	let [errorMsg, setErrorMsg] = React.useState('');
	let router = useRouter();
	let [isModalShowing, setIsModalShowing] = React.useState(false);
	let [isLoading, startTransition] = React.useTransition();

	let [sentenceDataReady, data] = useSentenceData();

	let sentenceCreateInput: SentenceCreateInputType;
	let sentenceUpdateInput: SentenceUpdateInputType;
	if (sentenceId) {
		sentenceUpdateInput = {
			...(data as Omit<SentenceUpdateInputType, 'id'>),
			id: sentenceId,
		};
	} else {
		sentenceCreateInput = {
			...(data as Omit<SentenceCreateInputType, 'sentence'>),
			sentence,
		};
	}

	function dismissModal() {
		setIsModalShowing(false);
	}

	function showModal() {
		setIsModalShowing(true);
	}

	function handleCancel() {
		router.back();

		if (sentenceId) {
			deleteLocalData(true);
		} else {
			deleteLocalData();
		}
	}

	async function handleSubmit() {
		setErrorMsg('');
		removeFromToast(TOAST_ID.SENTENCE_CREATION);
		startTransition(async () => {
			let result: { error: string } | { data: SentenceWithPieces };
			if (sentenceId) {
				result = await updateSentence(sentenceUpdateInput);
			} else {
				result = await createSentence(sentenceCreateInput);
			}

			if ('error' in result) {
				setErrorMsg(handleError(result.error));
				return;
			}
			deleteLocalData(true);
			addToToast({
				id: TOAST_ID.SENTENCE_CREATION,
				contentType: 'notice',
				content: sentence,
				title: 'Sentence Created',
			});
			if (sentenceId) {
				router.back();
			} else {
				router.replace('/');
			}
		});
	}

	return (
		<>
			<Wrapper>
				<HelpButton variant='outline' onClick={showModal} disabled={isLoading}>
					<Icon id='help' />
					<VisuallyHidden>Ask Any Questions</VisuallyHidden>
				</HelpButton>
				<SentenceAudio isSubmitting={isLoading} sentence={sentence} />
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
			{errorMsg && <Toast content={errorMsg} contentType='error' />}
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
