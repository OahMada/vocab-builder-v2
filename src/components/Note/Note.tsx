'use client';

import * as React from 'react';
import styled from 'styled-components';
import { FieldErrors, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import TextArea from '@/components/TextArea';
import CardWrapper from '@/app/(secondaryPages)/sentence/[sentenceId]/CardWrapper';
import Button from '@/components/Button';
import Icon from '@/components/Icon';
import TextareaActionButtons from '@/components/TextareaActionButtons';
import { NoteSchema, NoteType } from '@/lib';
import { useNoteContext } from '@/components/NoteProvider';
import { useGlobalToastContext } from '@/components/GlobalToastProvider';
import { TOAST_ID, INPUT_NAME } from '@/constants';

function Note({ title }: { title: React.ReactNode }) {
	let { note, updateNote, isEditing, updateEditingStatus } = useNoteContext();
	let { addToToast, resetToast } = useGlobalToastContext();

	let {
		register,
		watch,
		clearErrors,
		formState: { errors },
		setValue,
		handleSubmit,
	} = useForm<NoteType>({
		resolver: zodResolver(NoteSchema),
		reValidateMode: 'onSubmit',
		values: { note: note || '' },
	});

	let noteValue = watch(INPUT_NAME.NOTE);

	function clearInput() {
		clearErrors(INPUT_NAME.NOTE);
		resetToast(TOAST_ID.NOTE);
		setValue(INPUT_NAME.NOTE, '');
	}

	function cancelEditing() {
		updateEditingStatus(false);
	}

	function startEditing() {
		updateEditingStatus(true);
	}

	function onSubmit(data: NoteType) {
		updateNote(data.note);
		cancelEditing();
	}

	function onError(errors: FieldErrors<NoteType>) {
		let msg = errors.note!.message as string;
		addToToast({
			contentType: 'error',
			content: msg,
			id: TOAST_ID.NOTE,
		});
	}

	return isEditing ? (
		<>
			<CardWrapper>
				{title}

				<TextArea
					{...register(INPUT_NAME.NOTE, {
						onChange: () => {
							clearErrors(INPUT_NAME.NOTE);
							resetToast(TOAST_ID.NOTE);
						},
					})}
					value={noteValue}
					clearInput={clearInput}
					placeholder='Input note text here'
				/>
				<TextareaActionButtons handleCancel={cancelEditing} handleSubmit={handleSubmit(onSubmit, onError)} submitDisabled={!!errors.note} />
			</CardWrapper>
		</>
	) : note ? (
		<CardWrapper>
			{title}
			<NoteText>{note}</NoteText>
			<EditButton variant='fill' onClick={startEditing}>
				<EditIcon id='edit' size={16} />
				&nbsp;Edit
			</EditButton>
		</CardWrapper>
	) : (
		<AddNoteButton variant='fill' onClick={startEditing}>
			<Icon id='note' />
			&nbsp;Add Note
		</AddNoteButton>
	);
}

export default Note;

var AddNoteButton = styled(Button)`
	--bg-color: var(--bg-secondary);
	--hover-bg-color: var(--bg-secondary-hover);
`;

var NoteText = styled.p`
	white-space: pre-wrap;
`;

var EditButton = styled(Button)`
	align-self: flex-end;
`;

var EditIcon = styled(Icon)`
	/* optical alignment */
	transform: translateY(-0.5px);
`;
