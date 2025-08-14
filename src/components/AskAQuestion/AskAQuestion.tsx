'use client';

import * as React from 'react';
import styled from 'styled-components';
import { useCompletion } from '@ai-sdk/react';
import Modal from '@/components/Modal';
import ModalTitle from './ModalTitle';
import QuestionInput from './QuestionInput';
import { handleError } from '@/utils';
import Loading from '@/components/Loading';

interface AskAQuestionProps {
	isShowing: boolean;
	onDismiss: () => void;
}

function AskAQuestion({ isShowing, onDismiss }: AskAQuestionProps) {
	let [errorMsg, setErrorMsg] = React.useState('');
	let { complete, isLoading, completion, setCompletion } = useCompletion({
		api: '/api/ask-anything',
		onError: (error) => {
			// silence abort error
			if (error.name === 'TypeError' && error.message === 'network error') return;
			let msg = handleError(error);
			setErrorMsg(msg);
		},
	});
	function triggerComplete(text: string) {
		if (errorMsg) {
			setErrorMsg('');
		}
		complete('', {
			body: { question: text }, // send custom body
		});
	}

	function updateError(msg: string) {
		setErrorMsg(msg);
	}

	function onClearInput() {
		if (isLoading) {
			stop();
		}
		setCompletion('');
		setErrorMsg('');
	}

	return (
		<Modal isOpen={isShowing} onDismiss={onDismiss} title={<ModalTitle />} isOverlayTransparent={true} contentPosition='bottom'>
			<SmallHeading>Question:</SmallHeading>
			<QuestionInput triggerComplete={triggerComplete} updateError={updateError} onClearInput={onClearInput} submitDisabled={isLoading} />
			<SmallHeading>Answer:</SmallHeading>
			<AnswerBox style={{ '--icon-size': '18px' } as React.CSSProperties}>
				<AnswerText>{completion}</AnswerText>
				{errorMsg && <ErrorText>{errorMsg}</ErrorText>}
				{isLoading && <AnswerLoading description='loading answer to the question' />}
			</AnswerBox>
		</Modal>
	);
}

export default AskAQuestion;

var SmallHeading = styled.h3`
	font-size: 1.2rem;
	font-weight: 300;
	line-height: 1;
`;

var AnswerBox = styled.div`
	width: 100%;
	border-radius: 12px;
	background-color: var(--bg-secondary);
	flex: 1;
	position: relative;
	padding: 12px;
	overflow: auto;
	max-height: 30dvh;
	min-height: 30dvh;
	scrollbar-gutter: stable;
`;

var AnswerLoading = styled(Loading)`
	position: absolute;
	/* TODO change values in different breakpoints */
	/* bottom: 24px;
	right: 8px; */
	bottom: 12px;
	right: 12px;
`;

var ErrorText = styled.span`
	color: var(--text-status-warning);
`;

var AnswerText = styled.p`
	white-space: pre-wrap;
`;
