'use client';

import * as React from 'react';

interface NoteTextContextType {
	note: string;
	updateNote: (note: string) => void;
}

var NoteTextContext = React.createContext<NoteTextContextType | null>(null);

export default NoteTextContext;
