'use client';

import * as React from 'react';
import NoteContext from './NoteContext';
import { useReadLocalStorage } from '@/hooks';
import { updateLocalStorage } from '@/helpers';
import { LOCAL_STORAGE_KEY } from '@/constants';

function NoteProvider({ databaseNote, children }: { databaseNote?: string; children: React.ReactNode }) {
	let [note, setNote] = React.useState(databaseNote || undefined);
	let [isEditing, setIsEditing] = React.useState(false);

	let updateEditingStatus = React.useCallback(function (status: boolean) {
		setIsEditing(status);
	}, []);

	let updateNote = React.useCallback(function updateNote(note: string) {
		setNote(note);
	}, []);

	// write changes to local storage
	React.useEffect(() => {
		if (note) {
			updateLocalStorage<string>('save', LOCAL_STORAGE_KEY.NOTE, note);
		}
	}, [note]);
	let isLoading = useReadLocalStorage<string>(LOCAL_STORAGE_KEY.NOTE, updateNote);

	let value = React.useMemo(
		() => ({
			isEditing,
			updateEditingStatus,
			isLocalDataLoading: isLoading,
			note,
			updateNote,
		}),
		[isEditing, isLoading, note, updateEditingStatus, updateNote]
	);

	return <NoteContext.Provider value={value}>{children}</NoteContext.Provider>;
}
export default NoteProvider;
