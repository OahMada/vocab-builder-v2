'use client';

import * as React from 'react';
import styled from 'styled-components';
import { useCompletion } from '@ai-sdk/react';

import { QUERIES } from '@/constants';

import Modal from '@/components/Modal';
import ModalTitle from './ModalTitle';
import QuestionInput from './QuestionInput';
import BottomRightSpinner from '@/components/BottomRightSpinner';
import ClientMarkdown from '@/components/ClientMarkdown';

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
		<React.Suspense fallback={<BottomRightSpinner description='loading modal component' />}>
			<Modal
				isOpen={isShowing}
				onDismiss={onDismiss}
				heading={<ModalTitle />}
				isOverlayTransparent={true}
				contentPosition='bottom'
				style={{ '--background-color': 'var(--bg-secondary)' } as React.CSSProperties}
			>
				{(completion || errorMsg) && (
					<>
						<SmallHeading>Answer:</SmallHeading>
						<AnswerBoxWrapper>
							<AnswerBox style={{ '--icon-size': '18px' } as React.CSSProperties}>
								<React.Suspense fallback={completion}>
									<ClientMarkdown>{completion}</ClientMarkdown>
								</React.Suspense>
								{errorMsg && <ErrorText>{errorMsg}</ErrorText>}
							</AnswerBox>
						</AnswerBoxWrapper>
					</>
				)}
				<SmallHeading>Question:</SmallHeading>
				<QuestionInput triggerComplete={triggerComplete} onClearInput={onClearInput} isLoading={isLoading} />
			</Modal>
		</React.Suspense>
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
	background-color: var(--bg-tertiary);
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

var AnswerBoxWrapper = styled.div`
	border-radius: 12px;
	// to trim off the scroll bar corners
	overflow: hidden;
`;

var ErrorText = styled.span`
	color: var(--text-status-warning);
`;
