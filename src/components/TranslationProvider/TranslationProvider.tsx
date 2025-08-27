'use client';

import * as React from 'react';
import TranslationContext from './TranslationContext';
import { useReadLocalStorage } from '@/hooks';
import { updateLocalStorage } from '@/helpers';

function TranslationProvider({ databaseTranslation, children }: { databaseTranslation?: string; children: React.ReactNode }) {
	let [translation, setTranslation] = React.useState(databaseTranslation || undefined);
	let [isEditing, setIsEditing] = React.useState(false);

	let updateEditingStatus = React.useCallback(function (status: boolean) {
		setIsEditing(status);
	}, []);

	let updateTranslation = React.useCallback(function (translation: string) {
		setTranslation(translation);
	}, []);

	// write changes to local storage
	React.useEffect(() => {
		if (translation) {
			updateLocalStorage<string>('save', 'translation', translation);
		}
	}, [translation]);

	let isLoading = useReadLocalStorage<string>('translation', updateTranslation);

	let value = React.useMemo(
		() => ({
			isEditing,
			updateEditingStatus,
			isLocalDataLoading: isLoading,
			translation,
			updateTranslation,
		}),
		[isEditing, isLoading, translation, updateEditingStatus, updateTranslation]
	);

	return <TranslationContext.Provider value={value}>{children}</TranslationContext.Provider>;
}
export default TranslationProvider;
