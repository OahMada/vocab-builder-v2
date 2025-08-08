import * as React from 'react';

export interface TranslationTextContextType {
	translation: string;
	isLocalDataLoading: boolean;
	updateTranslation: (note: string) => void;
}

var TranslationTextContext = React.createContext<TranslationTextContextType | null>(null);

export default TranslationTextContext;
