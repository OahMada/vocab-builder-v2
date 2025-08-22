'use client';

import * as React from 'react';

interface NoteContextType {
	note: string | undefined;
	updateNote: (note: string) => void;
	isLocalDataLoading: boolean;
}

var NoteContext = React.createContext<NoteContextType | null>(null);

export default NoteContext;
