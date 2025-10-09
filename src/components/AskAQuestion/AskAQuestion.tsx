'use client';

import * as React from 'react';
import styled from 'styled-components';
import { useCompletion } from '@ai-sdk/react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { QUERIES } from '@/constants';

import Modal from '@/components/Modal';
import ModalTitle from './ModalTitle';
import QuestionInput from './QuestionInput';

interface AskAQuestionProps {
	isShowing: boolean;
	onDismiss: () => void;
	sentence: string;
}

function AskAQuestion({ isShowing, onDismiss, sentence }: AskAQuestionProps) {
	let [errorMsg, setErrorMsg] = React.useState('');
	let { complete, isLoading, setCompletion, completion, stop } = useCompletion({
		api: '/api/ask-anything',
		onError: (error) => {
			setErrorMsg(error.message);
		},
		experimental_throttle: 5,
	});
	function triggerComplete(text: string) {
		if (errorMsg) {
			setErrorMsg('');
		}
		complete('', {
			body: { question: text, sentence }, // send custom body
		});
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
			{(completion || errorMsg) && (
				<>
					<SmallHeading>Answer:</SmallHeading>
					<AnswerBox style={{ '--icon-size': '18px' } as React.CSSProperties}>
						<Markdown
							remarkPlugins={[remarkGfm]}
							components={{
								table: (props) => (
									<TableWrapper>
										<table {...props} />
									</TableWrapper>
								),
							}}
						>
							{completion}
						</Markdown>
						{errorMsg && <ErrorText>{errorMsg}</ErrorText>}
					</AnswerBox>
				</>
			)}
			<SmallHeading>Question:</SmallHeading>
			<QuestionInput triggerComplete={triggerComplete} onClearInput={onClearInput} isLoading={isLoading} />
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
	padding: 12px;
	overflow: auto;
	max-height: 45dvh;

	@media ${QUERIES.tabletAndUp} {
		max-height: 30dvh;
	}

	@media ${QUERIES.laptopAndUp} {
		max-height: 50dvh;
	}
`;

var ErrorText = styled.span`
	color: var(--text-status-warning);
`;

var TableWrapper = styled.div`
	overflow-x: auto;
	margin: 10px 0;
`;
