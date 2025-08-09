'use client';

import * as React from 'react';

interface TranslationTextContextType {
	translation: string;
	isLocalDataLoading: boolean;
	updateTranslation: (note: string) => void;
}

var TranslationTextContext = React.createContext<TranslationTextContextType | null>(null);

export default TranslationTextContext;
