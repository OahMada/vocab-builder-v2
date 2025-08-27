'use client';

import * as React from 'react';

interface NoteContextType {
	note?: string;
	updateNote: (note: string) => void;
	isLocalDataLoading: boolean;
	isEditing: boolean;
	updateEditingStatus: (status: boolean) => void;
}

var NoteContext = React.createContext<NoteContextType | null>(null);

export default NoteContext;
