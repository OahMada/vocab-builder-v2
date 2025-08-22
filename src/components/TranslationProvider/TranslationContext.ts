'use client';

import * as React from 'react';

interface TranslationContextType {
	translation: string | undefined;
	isLocalDataLoading: boolean;
	updateTranslation: (note: string) => void;
}

var TranslationContext = React.createContext<TranslationContextType | null>(null);

export default TranslationContext;
