'use client';

import * as React from 'react';
import styled from 'styled-components';
import Textarea from '@/components/Textarea';
import Spacer from '@/components/Spacer';
import Button from '@/components/Button';
import Icon from '@/components/Icon';
import CancelButton from '@/components/CancelButton';
import AcceptButton from '@/components/AcceptButton';

function Note() {
	let [isAddingNote, setIsAddingNote] = React.useState(false);

	return isAddingNote ? (
		<Wrapper>
			<Title>Note</Title>
			<Spacer size={18} />
			<Textarea />
			<Spacer size={12} />
			<ActionButtons>
				<CancelButton />
				<AcceptButton />
			</ActionButtons>
		</Wrapper>
	) : (
		<NoteButton variant='fill' onClick={() => setIsAddingNote(true)}>
			<Icon id='note' size={18} />
			&nbsp;Add Note
		</NoteButton>
	);
}

export default Note;

var Wrapper = styled.div`
	background-color: var(--bg-secondary);
	color: var(--text-primary);
	width: 100%;
	border-radius: 24px;
	padding: 12px;
`;

var Title = styled.h2`
	font-size: 1.5rem;
	font-weight: 500;
	line-height: 1;
	margin-top: 8px;
`;

var ActionButtons = styled.div`
	display: flex;
	gap: 8px;
	justify-content: flex-end;
`;

var NoteButton = styled(Button)`
	align-self: flex-start;
	margin-bottom: -8px;
	margin-top: 8px;
`;
