'use client';

import * as React from 'react';
import NoteTextContext from './NoteTextContext';
import { useReadLocalStorage } from '@/hooks';
import { updateLocalStorage } from '@/helpers';

function NoteTextProvider({ databaseNote, children }: { databaseNote?: string; children: React.ReactNode }) {
	let [note, setNote] = React.useState(databaseNote || '');

	let updateNote = React.useCallback(function updateNote(note: string) {
		setNote(note);
	}, []);

	useReadLocalStorage<string>('note-text', updateNote);

	// write changes to local storage
	React.useEffect(() => {
		updateLocalStorage<string>('save', 'note-text', note);
	}, [note]);

	let value = React.useMemo(
		() => ({
			note,
			updateNote,
		}),
		[note, updateNote]
	);

	return <NoteTextContext.Provider value={value}>{children}</NoteTextContext.Provider>;
}
export default NoteTextProvider;
