'use client';

import * as React from 'react';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import TextArea from '@/components/TextArea';
import CardWrapper from '@/app/(secondaryPages)/sentence/[sentenceId]/CardWrapper';
import Button from '@/components/Button';
import Icon from '@/components/Icon';
import TextareaActionButtons from '@/components/TextareaActionButtons';
import { NoteSchema, NoteType } from '@/lib';
import Toast from '@/components/Toast';
import { useNoteContext } from '@/components/NoteProvider';

function Note({ title }: { title: React.ReactNode }) {
	let { note, updateNote, isEditing, updateEditingStatus } = useNoteContext();

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

	let noteValue = watch('note');

	function clearInput() {
		clearErrors('note');
		setValue('note', '');
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

	return isEditing ? (
		<>
			<CardWrapper>
				{title}

				<TextArea
					{...register('note', {
						onChange: () => {
							clearErrors('note');
						},
					})}
					value={noteValue}
					clearInput={clearInput}
					placeholder='Input note text here'
				/>
				<TextareaActionButtons handleCancel={cancelEditing} handleSubmit={handleSubmit(onSubmit)} submitDisabled={!!errors.note} />
			</CardWrapper>
			{errors.note && <Toast content={errors.note.message} />}
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
