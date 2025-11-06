'use client';

import * as React from 'react';

interface AudioDataContextType {
	updateBlob: (audioBlob: Blob) => void;
	audioBlob?: Blob;
	audioUrl?: string;
}

var AudioDataContext = React.createContext<AudioDataContextType | null>(null);

export default AudioDataContext;
