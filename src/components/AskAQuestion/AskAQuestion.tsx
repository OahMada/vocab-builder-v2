'use client';

import * as React from 'react';
import styled from 'styled-components';
import Modal from '@/components/Modal';
import Textarea from '@/components/Textarea';
import Icon from '@/components/Icon';
import VisuallyHidden from '@/components/VisuallyHidden';
import ModalTitle from './ModalTitle';

interface AskAQuestionProps {
	isShowing: boolean;
	onDismiss: () => void;
}

function AskAQuestion({ isShowing, onDismiss }: AskAQuestionProps) {
	let [question, setQuestion] = React.useState('How are you doing today?');
	return (
		<Modal isOpen={isShowing} onDismiss={onDismiss} title={<ModalTitle />} isOverlayTransparent={true} contentPosition='bottom'>
			{/* TODO this should label */}
			<SmallHeading>Question:</SmallHeading>
			<TextareaWrapper>{/* <Textarea onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setQuestion(e.target.value)} /> */}</TextareaWrapper>
			<SmallHeading>Answer:</SmallHeading>
			<AnswerBox style={{ '--icon-size': '18px' } as React.CSSProperties}>
				<>
					<LoadIcon id='load' />
					<VisuallyHidden>Loading answer</VisuallyHidden>
				</>
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

var TextareaWrapper = styled.div`
	width: 100%;
	display: grid;
	grid-template-columns: 1fr max-content;
	gap: 6px;
	align-items: stretch;
`;

var AnswerBox = styled.div`
	width: 100%;
	border-radius: 12px;
	background-color: var(--bg-secondary);
	flex: 1;
	position: relative;
	min-height: calc(var(--icon-size) + 12px * 2);
`;

var LoadIcon = styled(Icon)`
	position: absolute;
	right: 12px;
	bottom: 12px;
`;
