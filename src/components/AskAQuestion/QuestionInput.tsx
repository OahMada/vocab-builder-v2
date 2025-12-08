'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';

import { QuestionInputSchema, QuestionInputType } from '@/lib';
import { INPUT_NAME } from '@/constants';

import TextArea from '@/components/TextArea';
import { Button } from '@/components/Button';
import Icon from '@/components/Icon';
import VisuallyHidden from '@/components/VisuallyHidden';
import FormErrorText from '@/components/FormErrorText';

export default function QuestionInput({
	triggerChat,
	isStreaming,
	stopStreaming,
}: {
	triggerChat: (text: string) => void;
	isStreaming: boolean;
	stopStreaming: () => void;
}) {
	let {
		register,
		watch,
		clearErrors,
		formState: { errors },
		setValue,
		handleSubmit,
	} = useForm<QuestionInputType>({
		resolver: zodResolver(QuestionInputSchema),
		reValidateMode: 'onSubmit',
		shouldFocusError: false,
	});

	let questionText = watch(INPUT_NAME.QUESTION);

	function clearInput() {
		clearErrors(INPUT_NAME.QUESTION);
		setValue(INPUT_NAME.QUESTION, '');
	}

	function onSubmit(data: QuestionInputType) {
		// stops sending new question while the previous one is still ongoing
		if (isStreaming) return;
		triggerChat(data.question);
		setValue(INPUT_NAME.QUESTION, '');
	}

	let submitHandler = handleSubmit(onSubmit);

	return (
		<Wrapper>
			<InnerWrapper>
				<TextArea
					autoFocus={true}
					placeholder='Input your question'
					value={questionText}
					{...register(INPUT_NAME.QUESTION, {
						onChange: () => {
							clearErrors(INPUT_NAME.QUESTION);
						},
					})}
					clearInput={clearInput}
					keydownSubmit={submitHandler}
					style={{ '--border-radius': '16px' } as React.CSSProperties}
					shouldPreventDefault={!isStreaming} // when loading reply, allowing creating new lines on enter
				/>
				{isStreaming ? (
					<StopButton variant='outline' onClick={stopStreaming} style={{ '--textarea-padding': '10px' } as React.CSSProperties}>
						<Icon id='stop' />
						<VisuallyHidden>stop streaming</VisuallyHidden>
					</StopButton>
				) : (
					<EnterButton
						variant='outline'
						onClick={submitHandler}
						disabled={!!errors.question}
						style={{ '--textarea-padding': '10px' } as React.CSSProperties}
					>
						<Icon id='upward' />
						<VisuallyHidden>submit question</VisuallyHidden>
					</EnterButton>
				)}
			</InnerWrapper>
			{errors.question && <FormErrorText>{errors.question.message}</FormErrorText>}
		</Wrapper>
	);
}

var Wrapper = styled.div`
	display: flex;
	flex-direction: column;
	gap: 5px;
`;

var InnerWrapper = styled.div`
	width: 100%;
	display: grid;
	grid-template-columns: 1fr auto;
	gap: 8px;
	align-items: stretch;
`;

var EnterButton = styled(Button)`
	--hover-bg-color: var(--bg-secondary);
	align-self: end;
	// essentially make the button the same height as the textarea element
	height: calc(1rem * 1.5 + var(--textarea-padding) * 2 + 2px);
	border-radius: 16px;
`;

var StopButton = styled(EnterButton)``;
