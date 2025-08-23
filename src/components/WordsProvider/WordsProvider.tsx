'use client';

import * as React from 'react';
import WordsContext from './WordContext';
import { Action, WordsType, RemoveIPAParams, AddIPAParams } from './types';
import { produce } from 'immer';
import { segmentSentence, updateLocalStorage } from '@/helpers';
import { useReadLocalStorage } from '@/hooks';

function reducer(state: WordsType, action: Action) {
	return produce(state, (draft) => {
		switch (action.type) {
			case 'addIPA':
				let { word, IPA } = action.payload;
				for (let item of draft) {
					if (typeof item !== 'string' && item.piece === word.text && item.id === word.id) {
						item.IPA = IPA;
					}
				}
				break;
			case 'removeIPA':
				for (let item of draft) {
					let { word, id } = action.payload;
					if (typeof item !== 'string' && item.piece === word && item.id === id) {
						item.IPA = undefined;
					}
				}
				break;

			case 'loadFromStorage':
				return action.payload;
				break;
		}
	});
}

function WordsProvider({ databaseWords, newSentence, children }: { databaseWords?: WordsType; newSentence?: string; children: React.ReactNode }) {
	let defaultState: WordsType = [];
	if (newSentence) {
		defaultState = segmentSentence(newSentence);
	}

	let [words, dispatch] = React.useReducer(reducer, databaseWords || defaultState);

	function loadLocalWordsData(data: WordsType) {
		dispatch({ type: 'loadFromStorage', payload: data });
	}

	let isLoading = useReadLocalStorage<WordsType>('words', loadLocalWordsData);

	// write changes to local storage
	React.useEffect(() => {
		updateLocalStorage<WordsType>('save', 'words', words);
	}, [words]);

	let addIPA = React.useCallback(function ({ text, id, IPA }: AddIPAParams) {
		dispatch({
			type: 'addIPA',
			payload: {
				word: {
					text,
					id,
				},
				IPA,
			},
		});
	}, []);

	let removeIPA = React.useCallback(function ({ word, id }: RemoveIPAParams) {
		dispatch({
			type: 'removeIPA',
			payload: {
				word,
				id,
			},
		});
	}, []);

	let value = React.useMemo(() => ({ isLocalDataLoading: isLoading, addIPA, removeIPA, words }), [addIPA, isLoading, removeIPA, words]);

	return <WordsContext.Provider value={value}>{children}</WordsContext.Provider>;
}

export default WordsProvider;
