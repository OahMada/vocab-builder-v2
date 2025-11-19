'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { m } from 'motion/react';

import { TranslationSchema, TranslationType } from '@/lib';
import { INPUT_NAME } from '@/constants';

import TextareaActionButtons from '@/components/TextareaActionButtons';
import TextArea from '@/components/TextArea';
import { useTranslationContext } from '@/components/TranslationProvider';
import FormErrorText from '@/components/FormErrorText';

export default function EditTranslation({ translationText, cancelEditing }: { translationText: string; cancelEditing: () => void }) {
	let { updateTranslation } = useTranslationContext();

	let {
		watch,
		setValue,
		register,
		handleSubmit,
		clearErrors,
		formState: { errors },
	} = useForm<TranslationType>({
		resolver: zodResolver(TranslationSchema),
		reValidateMode: 'onSubmit',
		values: { translation: translationText },
	});

	let translation = watch(INPUT_NAME.TRANSLATION);

	function clearInput() {
		clearErrors(INPUT_NAME.TRANSLATION);
		setValue(INPUT_NAME.TRANSLATION, translationText);
	}

	function onSubmit(data: TranslationType) {
		if (data.translation.length === 0) {
			// if the data is an empty string, submitting is the same as canceling
			return cancelEditing();
		}
		updateTranslation(data.translation);
		cancelEditing();
	}

	let submitHandler = handleSubmit(onSubmit);

	return (
		<>
			<InnerWrapper layout='position'>
				<TextArea
					value={translation}
					clearInput={clearInput}
					{...register('translation', {
						onChange: () => {
							clearErrors('translation');
						},
					})}
					placeholder='Input translation text here'
					autoFocus={true}
					keydownSubmit={submitHandler}
				/>
				{errors.translation && <FormErrorText>{errors.translation.message}</FormErrorText>}
			</InnerWrapper>
			<TextareaActionButtons handleCancel={cancelEditing} handleSubmit={submitHandler} submitDisabled={!!errors.translation} />
		</>
	);
}

var InnerWrapper = styled(m.div)`
	display: flex;
	flex-direction: column;
	gap: 5px;
`;
