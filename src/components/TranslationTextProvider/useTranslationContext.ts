import * as React from 'react';
import TranslationTextContext from './TranslationTextContext';

export function useTranslationTextContext() {
	let result = React.useContext(TranslationTextContext);
	if (!result) {
		throw new Error('useTranslationTextContext has to be used within <TranslationTextContext.Provider>');
	}
	return result;
}
