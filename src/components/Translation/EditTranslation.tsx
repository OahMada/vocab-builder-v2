'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { FieldErrors, useForm } from 'react-hook-form';
import TextareaActionButtons from '@/components/TextareaActionButtons';
import TextArea from '@/components/TextArea';
import { TranslationSchema, TranslationType } from '@/lib';
import { useTranslationContext } from '@/components/TranslationProvider';
import { useGlobalToastContext } from '@/components/GlobalToastProvider';
import { TOAST_ID, INPUT_NAME } from '@/constants';

export default function EditTranslation({ translationText, cancelEditing }: { translationText: string; cancelEditing: () => void }) {
	let { addToToast, removeFromToast } = useGlobalToastContext();
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
		removeFromToast(TOAST_ID.TRANSLATION_EDITING);
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

	function onError(errors: FieldErrors<TranslationType>) {
		addToToast({
			id: TOAST_ID.TRANSLATION_EDITING,
			contentType: 'error',
			content: errors.translation!.message,
		});
	}

	return (
		<>
			<TextArea
				value={translation}
				clearInput={clearInput}
				{...register(INPUT_NAME.TRANSLATION, {
					onChange: () => {
						removeFromToast(TOAST_ID.TRANSLATION_EDITING);
						clearErrors(INPUT_NAME.TRANSLATION);
					},
				})}
				placeholder='Input translation text here'
				autoFocus={true}
			/>
			<TextareaActionButtons handleCancel={cancelEditing} handleSubmit={handleSubmit(onSubmit, onError)} submitDisabled={!!errors.translation} />
		</>
	);
}
