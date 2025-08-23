'use client';

import * as React from 'react';
import styled from 'styled-components';
import { useCompletion } from '@ai-sdk/react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Modal from '@/components/Modal';
import ModalTitle from './ModalTitle';
import QuestionInput from './QuestionInput';
import Loading from '@/components/Loading';

interface AskAQuestionProps {
	isShowing: boolean;
	onDismiss: () => void;
}

function AskAQuestion({ isShowing, onDismiss }: AskAQuestionProps) {
	let [errorMsg, setErrorMsg] = React.useState('');
	let { complete, isLoading, setCompletion, completion } = useCompletion({
		api: '/api/ask-anything',
		onError: (error) => {
			// to silence the active abort error
			if (error.name === 'TypeError' && error.message === 'network error') return;
			setErrorMsg(error.message);
		},
		experimental_throttle: 5,
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
				<Markdown remarkPlugins={[remarkGfm]}>{completion}</Markdown>
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
	max-height: 70dvh;
	min-height: 20dvh;
	/* scrollbar-gutter: stable; */
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
