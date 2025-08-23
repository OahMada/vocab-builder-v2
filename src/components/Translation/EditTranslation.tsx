'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import TextareaActionButtons from '@/components/TextareaActionButtons';
import Textarea from '@/components/Textarea/Textarea';
import { TranslationSchema, TranslationType } from '@/lib';
import Toast from '@/components/Toast';
import { useTranslationContext } from '@/components/TranslationProvider';

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

	let translationTextValue = watch('translation');

	function clearInput() {
		clearErrors('translation');
		setValue('translation', translationText);
	}

	function onSubmit(data: TranslationType) {
		if (data.translation.length === 0) {
			// if the data is an empty string, submitting is the same as canceling
			return cancelEditing();
		}
		updateTranslation(data.translation);
		cancelEditing();
	}

	return (
		<>
			<Textarea
				value={translationTextValue}
				clearInput={clearInput}
				{...register('translation', {
					onChange: () => {
						clearErrors('translation');
					},
				})}
				placeholder='Input translation text here'
			/>
			<TextareaActionButtons handleCancel={cancelEditing} handleSubmit={handleSubmit(onSubmit)} submitDisabled={!!errors.translation} />
			{errors.translation && <Toast content={errors.translation.message} />}
		</>
	);
}
