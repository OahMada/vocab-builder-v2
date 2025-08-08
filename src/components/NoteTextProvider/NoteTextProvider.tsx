'use client';

import * as React from 'react';
import NoteTextContext from './NoteTextContext';
import { useReadLocalStorage } from '@/hooks';
import { updateLocalStorage } from '@/helpers';

function NoteTextProvider({ databaseNote, children }: { databaseNote?: string; children: React.ReactNode }) {
	let [note, setNote] = React.useState(databaseNote || '');

	let [savedNote] = useReadLocalStorage<string>('note-text');

	// load previously saved localStorage data
	React.useEffect(() => {
		if (savedNote) {
			setNote(savedNote);
		}
	}, [savedNote]);

	// write changes to local storage
	React.useEffect(() => {
		updateLocalStorage<string>('save', 'note-text', note);
	}, [note]);

	let updateNote = React.useCallback(function (note: string) {
		setNote(note);
	}, []);

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

export function useNoteTextContext() {
	let result = React.useContext(NoteTextContext);
	if (!result) {
		throw new Error('useNoteTextContext has to be used within <NoteTextContext.Provider>');
	}
	return result;
}
