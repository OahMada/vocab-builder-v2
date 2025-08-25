'use client';

import * as React from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';
import Button from '@/components/Button';
import VisuallyHidden from '@/components/VisuallyHidden';
import Icon from '@/components/Icon';
import AskAQuestion from '@/components/AskAQuestion';
import SentenceAudio from '@/components/SentenceAudio';
import createSentenceData from '@/app/actions/createSentence';
import { deleteLocalData } from '@/helpers/deleteLocalData';
import Loading from '@/components/Loading';
import { useSentenceData } from '@/hooks';
import { handleError } from '@/utils';
import { Toast } from '@/components/Toast';

function SentenceActions({ sentence }: { sentence: string }) {
	let [errorMsg, setErrorMsg] = React.useState('');
	let router = useRouter();
	let [isModalShowing, setIsModalShowing] = React.useState(false);
	let [isLoading, startTransition] = React.useTransition();

	let [sentenceDataReady, data] = useSentenceData();
	let sentenceData = {
		...data,
		sentence,
	};

	function dismissModal() {
		setIsModalShowing(false);
	}

	function showModal() {
		setIsModalShowing(true);
	}

	function handleCancel() {
		router.back();
		deleteLocalData();
	}

	async function handleSubmit() {
		setErrorMsg('');
		startTransition(async () => {
			let result = await createSentenceData(sentenceData);

			if ('error' in result) {
				setErrorMsg(handleError(result.error));
				return;
			}
			deleteLocalData(true);
			router.replace('/');
		});
	}

	return (
		<>
			<Wrapper>
				<HelpButton variant='outline' onClick={showModal} disabled={isLoading}>
					<Icon id='help' />
					<VisuallyHidden>Ask Any Questions</VisuallyHidden>
				</HelpButton>
				<SentenceAudio isSubmitting={isLoading} />
				<CancelButton variant='outline' onClick={handleCancel} disabled={isLoading}>
					<Icon id='x' />
					&nbsp;Cancel
				</CancelButton>
				<DoneButton variant='outline' disabled={!sentenceDataReady || isLoading} onClick={handleSubmit}>
					{isLoading ? <Loading description='submitting data' /> : <Icon id='enter' />}
					&nbsp;Done
				</DoneButton>
			</Wrapper>
			{isModalShowing && <AskAQuestion isShowing={isModalShowing} onDismiss={dismissModal} />}
			{errorMsg && <Toast content={errorMsg} />}
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
