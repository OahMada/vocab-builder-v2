'use client';

import * as React from 'react';

interface AudioBlobContextType {
	updateBlob: (audioBlob: Blob) => void;
	isLocalDataLoading: boolean;
	audioBlob: Blob | undefined;
}

var AudioBlobContext = React.createContext<AudioBlobContextType | null>(null);

export default AudioBlobContext;
