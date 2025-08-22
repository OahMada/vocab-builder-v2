'use client';

import * as React from 'react';
import TranslationContext from './TranslationContext';
import { useReadLocalStorage } from '@/hooks';
import { updateLocalStorage } from '@/helpers';

function TranslationProvider({ databaseTranslation, children }: { databaseTranslation?: string; children: React.ReactNode }) {
	let [translation, setTranslation] = React.useState(databaseTranslation || undefined);

	let updateTranslation = React.useCallback(function (translation: string) {
		setTranslation(translation);
	}, []);

	let isLoading = useReadLocalStorage<string>('translation', updateTranslation);

	// write changes to local storage
	React.useEffect(() => {
		if (translation) {
			updateLocalStorage<string>('save', 'translation', translation);
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

	return <TranslationContext.Provider value={value}>{children}</TranslationContext.Provider>;
}
export default TranslationProvider;
