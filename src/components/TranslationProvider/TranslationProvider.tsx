'use client';

import * as React from 'react';

import TranslationContext from './TranslationContext';

function TranslationProvider({ databaseTranslation, children }: { databaseTranslation?: string; children: React.ReactNode }) {
	let [translation, setTranslation] = React.useState(databaseTranslation || undefined);
	let [isEditing, setIsEditing] = React.useState(false);

	let updateEditingStatus = React.useCallback(function (status: boolean) {
		setIsEditing(status);
	}, []);

	let updateTranslation = React.useCallback(function (translation: string) {
		setTranslation(translation);
	}, []);

	let value = React.useMemo(
		() => ({
			isEditing,
			updateEditingStatus,
			translation,
			updateTranslation,
		}),
		[isEditing, translation, updateEditingStatus, updateTranslation]
	);

	return <TranslationContext.Provider value={value}>{children}</TranslationContext.Provider>;
}
export default TranslationProvider;
