'use client';

import * as React from 'react';
import TranslationTextContext from './TranslationTextContext';
import { useReadLocalStorage } from '@/hooks';
import { updateLocalStorage } from '@/helpers';

function TranslationTextProvider({ databaseTranslation, children }: { databaseTranslation?: string; children: React.ReactNode }) {
	let [translation, setTranslation] = React.useState(databaseTranslation || '');

	let updateTranslation = React.useCallback(function (translation: string) {
		setTranslation(translation);
	}, []);

	let isLoading = useReadLocalStorage<string>('translation-text', updateTranslation);

	// write changes to local storage
	React.useEffect(() => {
		if (translation !== '') {
			updateLocalStorage<string>('save', 'translation-text', translation);
		}
	}, [translation]);

	let value = React.useMemo(
		() => ({
			isLocalDataLoading: isLoading,
			translation,
			updateTranslation,
		}),
		[isLoading, translation, updateTranslation]
	);

	return <TranslationTextContext.Provider value={value}>{children}</TranslationTextContext.Provider>;
}
export default TranslationTextProvider;
