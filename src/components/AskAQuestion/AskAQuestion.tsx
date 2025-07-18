'use client';

import * as React from 'react';
import styled from 'styled-components';
import BottomDrawer from '@/components/BottomDrawer';
import Textarea from '@/components/Textarea';
import Icon from '@/components/Icon';
import Button from '@/components/Button';
import VisuallyHidden from '@/components/VisuallyHidden';

interface AskAQuestionProps {
	isShowing: boolean;
	onDismiss: () => void;
}

function AskAQuestion({ isShowing, onDismiss }: AskAQuestionProps) {
	let [question, setQuestion] = React.useState('How are you doing today?');
	let [isEditing, setIsEditing] = React.useState(true);
	return (
		<BottomDrawer isOpen={isShowing} onDismiss={onDismiss}>
			<SmallHeader>Question:</SmallHeader>
			<TextareaWrapper>
				{question ? (
					<QuestionText>{question}</QuestionText>
				) : (
					<Textarea question={question} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setQuestion(e.target.value)} />
				)}
				{isEditing ? (
					<QuestionButton
						variant='fill'
						onClick={() => {
							setQuestion('How are you doing today?');
							setIsEditing(false);
						}}
					>
						<Icon id='enter' />
						<VisuallyHidden>Done editing</VisuallyHidden>
					</QuestionButton>
				) : (
					<QuestionButton
						variant='fill'
						onClick={() => {
							setQuestion('');
							setIsEditing(true);
						}}
					>
						<Icon id='retry' />
						<VisuallyHidden>Retry</VisuallyHidden>
					</QuestionButton>
				)}
			</TextareaWrapper>
			<SmallHeader>Answer:</SmallHeader>
			<AnswerBox>
				<>
					<LoadIcon id='load' />
					<VisuallyHidden>Loading answer</VisuallyHidden>
				</>
			</AnswerBox>
		</BottomDrawer>
	);
}

export default AskAQuestion;

var SmallHeader = styled.h3`
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

var QuestionText = styled.p`
	border-radius: 12px;
	padding: 12px;
	background-color: var(--bg-secondary);
`;

var QuestionButton = styled(Button)`
	border-radius: 12px;
	padding: 12px;
	--bg-color: var(--bg-secondary);
	--hover-bg-color: var(--bg-tertiary);
`;

var AnswerBox = styled.div`
	width: 100%;
	border-radius: 12px;
	background-color: var(--bg-secondary);
	flex: 1;
	position: relative;
`;

var LoadIcon = styled(Icon)`
	position: absolute;
	right: 12px;
	bottom: 12px;
`;
