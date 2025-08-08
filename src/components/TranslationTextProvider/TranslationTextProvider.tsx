'use client';

import * as React from 'react';
import TranslationTextContext from './TranslationTextContext';
import { useReadLocalStorage } from '@/hooks';
import { updateLocalStorage } from '@/helpers';

function TranslationTextProvider({ databaseTranslation, children }: { databaseTranslation?: string; children: React.ReactNode }) {
	let [translation, setTranslation] = React.useState(databaseTranslation || '');
	let [savedTranslation, loading] = useReadLocalStorage<string>('translation-text');

	// load previously saved localStorage data
	React.useEffect(() => {
		if (savedTranslation) {
			setTranslation(savedTranslation);
		}
	}, [savedTranslation]);

	// write changes to local storage
	React.useEffect(() => {
		updateLocalStorage<string>('save', 'translation-text', translation);
	}, [translation]);

	let updateTranslation = React.useCallback(function updateTranslation(note: string) {
		setTranslation(note);
	}, []);

	let value = React.useMemo(
		() => ({
			isLocalDataLoading: loading,
			translation,
			updateTranslation,
		}),
		[loading, translation, updateTranslation]
	);

	return <TranslationTextContext.Provider value={value}>{children}</TranslationTextContext.Provider>;
}
export default TranslationTextProvider;

export function useTranslationTextContext() {
	let result = React.useContext(TranslationTextContext);
	if (!result) {
		throw new Error('useTranslationTextContext has to be used within <TranslationTextContext.Provider>');
	}
	return result;
}
