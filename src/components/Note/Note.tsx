'use client';

import * as React from 'react';
import styled from 'styled-components';
import Textarea from '@/components/Textarea';
import CardWrapper from '@/app/sentence/[id]/CardWrapper';
import Button from '@/components/Button';
import Icon from '@/components/Icon';
import TextareaActionButtons from '@/components/TextareaActionButtons';

function Note({ title }: { title: React.ReactNode }) {
	let [isAddingNote, setIsAddingNote] = React.useState(false);

	return isAddingNote ? (
		<CardWrapper>
			{title}
			<Textarea />
			<TextareaActionButtons />
		</CardWrapper>
	) : (
		<AddNoteButton variant='outline' onClick={() => setIsAddingNote(true)}>
			<Icon id='note' />
			&nbsp;Add Note
		</AddNoteButton>
	);
}

export default Note;

var AddNoteButton = styled(Button)`
	align-self: flex-start;
	margin-bottom: -5px;
	margin-top: 8px;
`;
