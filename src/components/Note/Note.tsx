'use client';

import * as React from 'react';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { m } from 'motion/react';

import { NoteSchema, NoteType } from '@/lib';
import { CUSTOM_SPRING, INPUT_NAME } from '@/constants';

import CardWrapper from '@/components/CardWrapper';
import TextArea from '@/components/TextArea';
import { MotionButton } from '@/components/Button';
import Icon from '@/components/Icon';
import TextareaActionButtons from '@/components/TextareaActionButtons';
import { useNoteContext } from '@/components/NoteProvider';
import FormErrorText from '@/components/FormErrorText';
import Title from '@/components/CardTitle';
import { useSentenceSubmittingContext } from '@/components/SentenceSubmittingProvider';

function Note() {
	let { isSubmitting } = useSentenceSubmittingContext();
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

	let noteValue = watch(INPUT_NAME.NOTE);

	function clearInput() {
		clearErrors(INPUT_NAME.NOTE);
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

	let submitHandler = handleSubmit(onSubmit);

	return isEditing ? (
		<>
			<CardWrapper transition={CUSTOM_SPRING} layout={true} initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
				<Title layout='position'>Note</Title>
				<InnerWrapper layout='position'>
					<TextArea
						{...register(INPUT_NAME.NOTE, {
							onChange: () => {
								clearErrors(INPUT_NAME.NOTE);
							},
						})}
						value={noteValue}
						clearInput={clearInput}
						placeholder='Input note text here'
						autoFocus={true}
						keydownSubmit={submitHandler}
					/>
					{errors.note && <FormErrorText>{errors.note.message}</FormErrorText>}
				</InnerWrapper>
				<TextareaActionButtons handleCancel={cancelEditing} handleSubmit={submitHandler} submitDisabled={!!errors.note} />
			</CardWrapper>
		</>
	) : note ? (
		<CardWrapper transition={CUSTOM_SPRING} layout={true}>
			<Title layout='position'>Note</Title>
			<NoteText layout='position'> {note}</NoteText>
			<EditButton variant='fill' onClick={startEditing} layout='position' disabled={isSubmitting}>
				<EditIcon id='edit' size={16} />
				&nbsp;Edit
			</EditButton>
		</CardWrapper>
	) : (
		<AddNoteButton variant='fill' onClick={startEditing} layout={true} disabled={isSubmitting}>
			<Icon id='note' />
			&nbsp;Add Note
		</AddNoteButton>
	);
}

export default Note;

var AddNoteButton = styled(MotionButton)`
	--bg-color: var(--bg-secondary);
	--hover-bg-color: var(--bg-secondary-hover);
`;

var NoteText = styled(m.p)`
	white-space: pre-wrap;
`;

var EditButton = styled(MotionButton)`
	align-self: flex-end;
`;

var EditIcon = styled(Icon)`
	/* optical alignment */
	transform: translateY(-0.5px);
`;

var InnerWrapper = styled(m.div)`
	display: flex;
	flex-direction: column;
	gap: 5px;
`;
