'use client';

import * as React from 'react';

interface AudioDataContextType {
	updateBlob: (audioBlob: Blob) => void;
	isLocalDataLoading: boolean;
	audioBlob?: Blob;
	audioUrl?: string;
	updateHash: (hash: string) => void;
	audioHash?: string;
}

var AudioDataContext = React.createContext<AudioDataContextType | null>(null);

export default AudioDataContext;
