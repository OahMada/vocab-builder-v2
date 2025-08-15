'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import TextareaActionButtons from '@/components/TextareaActionButtons';
import Textarea from '@/components/Textarea';
import { TranslationTextSchema, TranslationType } from '@/lib';
import Toast from '@/components/Toast';
import { useTranslationTextContext } from '@/components/TranslationTextProvider';

export default function EditTranslation({ translationText, cancelEditing }: { translationText: string; cancelEditing: () => void }) {
	let { updateTranslation } = useTranslationTextContext();

	let {
		watch,
		setValue,
		register,
		handleSubmit,
		clearErrors,
		formState: { errors },
	} = useForm<TranslationType>({
		resolver: zodResolver(TranslationTextSchema),
		reValidateMode: 'onSubmit',
		values: { 'translation-text': translationText },
	});

	let translationTextValue = watch('translation-text');

	function clearInput() {
		clearErrors('translation-text');
		setValue('translation-text', translationText);
	}

	function onSubmit(data: TranslationType) {
		if (data['translation-text'].length === 0) {
			// if the data is an empty string, submitting is the same as canceling
			return cancelEditing();
		}
		updateTranslation(data['translation-text']);
		cancelEditing();
	}

	return (
		<>
			<Textarea
				value={translationTextValue}
				clearInput={clearInput}
				{...register('translation-text', {
					onChange: () => {
						clearErrors('translation-text');
					},
				})}
				placeholder='Input translation text here'
			/>
			<TextareaActionButtons handleCancel={cancelEditing} handleSubmit={handleSubmit(onSubmit)} submitDisabled={!!errors['translation-text']} />
			{errors['translation-text'] && <Toast content={errors['translation-text'].message} />}
		</>
	);
}
