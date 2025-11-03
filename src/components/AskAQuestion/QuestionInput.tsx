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
import Loading from '@/components/Loading';
import FormErrorText from '@/components/FormErrorText';

export default function QuestionInput({
	triggerComplete,
	onClearInput,
	isLoading,
}: {
	triggerComplete: (text: string) => void;
	onClearInput: () => void;
	isLoading: boolean;
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
		onClearInput();
	}

	function onSubmit(data: QuestionInputType) {
		triggerComplete(data.question);
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
				/>
				<EnterButton
					variant='fill'
					onClick={submitHandler}
					disabled={!!errors.question || isLoading}
					style={{ '--textarea-padding': '10px' } as React.CSSProperties}
				>
					{isLoading ? (
						<Loading description='answer is loading' />
					) : (
						<>
							<Icon id='enter' />
							<VisuallyHidden>submit question</VisuallyHidden>
						</>
					)}
				</EnterButton>
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
	align-self: end;
	// essentially make the button the same height as the textarea element
	height: calc(1rem * 1.5 + var(--textarea-padding) * 2 + 2px);
`;
