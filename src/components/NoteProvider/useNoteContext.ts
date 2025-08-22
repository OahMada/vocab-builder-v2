import * as React from 'react';
import NoteContext from './NoteContext';

export function useNoteContext() {
	let result = React.useContext(NoteContext);
	if (!result) {
		throw new Error('useNoteTextContext has to be used within <NoteTextContext.Provider>');
	}
	return result;
}
