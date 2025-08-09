import * as React from 'react';
import NoteTextContext from './NoteTextContext';

export function useNoteTextContext() {
	let result = React.useContext(NoteTextContext);
	if (!result) {
		throw new Error('useNoteTextContext has to be used within <NoteTextContext.Provider>');
	}
	return result;
}
