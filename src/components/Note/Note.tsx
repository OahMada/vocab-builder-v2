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
		<AddNoteButton variant='fill' onClick={() => setIsAddingNote(true)}>
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
