'use client';

import * as React from 'react';
import styled from 'styled-components';
import BottomDrawer from '@/components/BottomDrawer';
import Textarea from '@/components/Textarea';
import Icon from '@/components/Icon';
import VisuallyHidden from '@/components/VisuallyHidden';

interface AskAQuestionProps {
	isShowing: boolean;
	onDismiss: () => void;
}

function AskAQuestion({ isShowing, onDismiss }: AskAQuestionProps) {
	let [question, setQuestion] = React.useState('How are you doing today?');
	return (
		<BottomDrawer isOpen={isShowing} onDismiss={onDismiss}>
			<SmallHeading>Question:</SmallHeading>
			<TextareaWrapper>
				<Textarea question={question} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setQuestion(e.target.value)} />
			</TextareaWrapper>
			<SmallHeading>Answer:</SmallHeading>
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
`;

var LoadIcon = styled(Icon)`
	position: absolute;
	right: 12px;
	bottom: 12px;
`;
