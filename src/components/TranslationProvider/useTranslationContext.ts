import * as React from 'react';

import TranslationContext from './TranslationContext';

export function useTranslationContext() {
	let result = React.useContext(TranslationContext);
	if (!result) {
		throw new Error('useTranslationTextContext has to be used within <TranslationTextContext.Provider>');
	}
	return result;
}
