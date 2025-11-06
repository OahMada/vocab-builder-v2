'use client';

import * as React from 'react';

import NoteContext from './NoteContext';

function NoteProvider({ databaseNote, children }: { databaseNote?: string; children: React.ReactNode }) {
	let [note, setNote] = React.useState(databaseNote || undefined);
	let [isEditing, setIsEditing] = React.useState(false);

	let updateEditingStatus = React.useCallback(function (status: boolean) {
		setIsEditing(status);
	}, []);

	let updateNote = React.useCallback(function updateNote(note: string) {
		setNote(note);
	}, []);

	let value = React.useMemo(
		() => ({
			isEditing,
			updateEditingStatus,
			note,
			updateNote,
		}),
		[isEditing, note, updateEditingStatus, updateNote]
	);

	return <NoteContext.Provider value={value}>{children}</NoteContext.Provider>;
}
export default NoteProvider;
