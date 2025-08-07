'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import TextareaActionButtons from '@/components/TextareaActionButtons';
import Textarea from '@/components/Textarea';
import { TranslationTextSchema, TranslationText } from '@/lib';
import { useSentenceDataProvider } from '@/components/SentenceDataProvider';
import Toast from '@/components/Toast';

export default function EditTranslation({ translationText, cancelEditing }: { translationText: string; cancelEditing: () => void }) {
	let { updateTranslation } = useSentenceDataProvider();

	let {
		watch,
		setValue,
		register,
		handleSubmit,
		clearErrors,
		formState: { errors },
	} = useForm<TranslationText>({
		resolver: zodResolver(TranslationTextSchema),
		reValidateMode: 'onSubmit',
		values: { 'translation-text': translationText },
		shouldFocusError: false,
	});

	let translationTextValue = watch('translation-text');

	function clearInput() {
		clearErrors('translation-text');
		setValue('translation-text', translationText);
	}

	function onSubmit(data: TranslationText) {
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
				placeholder='Input translation text.'
			/>
			<TextareaActionButtons handleCancel={cancelEditing} handleSubmit={handleSubmit(onSubmit)} />
			{errors['translation-text'] && <Toast content={errors['translation-text'].message} />}
		</>
	);
}
