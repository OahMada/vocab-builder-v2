'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { FieldErrors, useForm } from 'react-hook-form';
import TextareaActionButtons from '@/components/TextareaActionButtons';
import TextArea from '@/components/TextArea';
import { TranslationSchema, TranslationType } from '@/lib';
import { useTranslationContext } from '@/components/TranslationProvider';
import { useGlobalToastContext } from '@/components/GlobalToastProvider';

export default function EditTranslation({ translationText, cancelEditing }: { translationText: string; cancelEditing: () => void }) {
	let { addToToast, resetToast } = useGlobalToastContext();
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
		resetToast('translation');
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

	function onError(errors: FieldErrors<TranslationType>) {
		addToToast({
			id: 'translation',
			contentType: 'error',
			content: errors.translation!.message,
		});
	}

	return (
		<>
			<TextArea
				value={translationTextValue}
				clearInput={clearInput}
				{...register('translation', {
					onChange: () => {
						resetToast('translation');
						clearErrors('translation');
					},
				})}
				placeholder='Input translation text here'
			/>
			<TextareaActionButtons handleCancel={cancelEditing} handleSubmit={handleSubmit(onSubmit, onError)} submitDisabled={!!errors.translation} />
		</>
	);
}
