'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import * as React from 'react';
import { FieldErrors, useForm } from 'react-hook-form';
import styled from 'styled-components';
import { FetchAnswersSchema, FetchAnswersType } from '@/lib';
import Textarea from '@/components/Textarea/Textarea';
import Button from '@/components/Button';
import Icon from '@/components/Icon';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

export default function QuestionInput({
	triggerComplete,
	updateError,
	onClearInput,
	submitDisabled,
}: {
	triggerComplete: (text: string) => void;
	updateError: (msg: string) => void;
	onClearInput: () => void;
	submitDisabled: boolean;
}) {
	let {
		register,
		watch,
		clearErrors,
		formState: { errors },
		setValue,
		handleSubmit,
	} = useForm<FetchAnswersType>({
		resolver: zodResolver(FetchAnswersSchema),
		reValidateMode: 'onSubmit',
		shouldFocusError: false,
	});

	let questionText = watch('question');

	function clearInput() {
		clearErrors('question');
		updateError('');
		setValue('question', '');
		onClearInput();
	}

	function onSubmit(data: FetchAnswersType) {
		triggerComplete(data.question);
	}
	function onError(errors: FieldErrors<FetchAnswersType>) {
		let msg = errors.question?.message as string;
		updateError(msg);
	}

	return (
		<Wrapper>
			<Textarea
				autoFocus={true}
				placeholder='Input your question'
				value={questionText}
				{...register('question', {
					onChange: () => {
						clearErrors('question');
						updateError('');
					},
				})}
				clearInput={clearInput}
			/>
			<EnterButton
				variant='fill'
				onClick={handleSubmit(onSubmit, onError)}
				disabled={!!errors.question || submitDisabled}
				style={{ '--textarea-padding': '10px' } as React.CSSProperties}
			>
				<Icon id='enter' />
				<VisuallyHidden>submit question</VisuallyHidden>
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
