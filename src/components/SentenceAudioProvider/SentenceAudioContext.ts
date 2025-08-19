'use client';

import * as React from 'react';

interface SentenceAudioContextType {
	updateBlob: (audioBlob: Blob) => void;
	isLocalDataLoading: boolean;
	blob: Blob | null;
}

var SentenceAudioContext = React.createContext<SentenceAudioContextType | null>(null);

export default SentenceAudioContext;
