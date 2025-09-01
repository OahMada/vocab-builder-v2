'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import * as React from 'react';
import { FieldErrors, useForm } from 'react-hook-form';
import styled from 'styled-components';
import { QuestionInputSchema, QuestionInputType } from '@/lib';
import TextArea from '@/components/TextArea';
import Button from '@/components/Button';
import Icon from '@/components/Icon';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import Loading from '@/components/Loading';
import { INPUT_NAME } from '@/constants';

export default function QuestionInput({
	triggerComplete,
	updateError,
	onClearInput,
	isLoading,
}: {
	triggerComplete: (text: string) => void;
	updateError: (msg: string) => void;
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
		updateError('');
		setValue(INPUT_NAME.QUESTION, '');
		onClearInput();
	}

	function onSubmit(data: QuestionInputType) {
		triggerComplete(data.question);
	}
	function onError(errors: FieldErrors<QuestionInputType>) {
		let msg = errors.question!.message as string;
		updateError(msg);
	}

	return (
		<Wrapper>
			<TextArea
				autoFocus={true}
				placeholder='Input your question'
				value={questionText}
				{...register(INPUT_NAME.QUESTION, {
					onChange: () => {
						clearErrors(INPUT_NAME.QUESTION);
						updateError('');
					},
				})}
				clearInput={clearInput}
			/>
			<EnterButton
				variant='fill'
				onClick={handleSubmit(onSubmit, onError)}
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
		</Wrapper>
	);
}

var Wrapper = styled.div`
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
