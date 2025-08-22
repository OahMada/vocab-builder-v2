'use client';

import * as React from 'react';
import NoteContext from './NoteContext';
import { useReadLocalStorage } from '@/hooks';
import { updateLocalStorage } from '@/helpers';

function NoteProvider({ databaseNote, children }: { databaseNote?: string; children: React.ReactNode }) {
	let [note, setNote] = React.useState(databaseNote || undefined);

	let updateNote = React.useCallback(function updateNote(note: string) {
		setNote(note);
	}, []);

	let isLoading = useReadLocalStorage<string>('note', updateNote);

	// write changes to local storage
	React.useEffect(() => {
		if (note) {
			updateLocalStorage<string>('save', 'note', note);
		}
	}, [note]);

	let value = React.useMemo(
		() => ({
			isLocalDataLoading: isLoading,
			note,
			updateNote,
		}),
		[isLoading, note, updateNote]
	);

	return <NoteContext.Provider value={value}>{children}</NoteContext.Provider>;
}
export default NoteProvider;
