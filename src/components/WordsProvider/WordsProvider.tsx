'use client';

import * as React from 'react';
import WordsContext from './WordContext';
import { Action, PiecesType, RemoveIPAParams, AddIPAParams } from './types';
import { produce } from 'immer';
import { segmentSentence, updateLocalStorage } from '@/helpers';
import { useReadLocalStorage } from '@/hooks';

function reducer(state: PiecesType, action: Action) {
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
		}
	});
}

function WordsProvider({
	databaseWords,
	newSentence,
	children,
}: {
	databaseWords?: Extract<PiecesType, object>;
	newSentence?: string;
	children: React.ReactNode;
}) {
	let defaultState: PiecesType = [];
	if (newSentence) {
		defaultState = segmentSentence(newSentence);
	}

	let [pieces, dispatch] = React.useReducer(reducer, databaseWords || defaultState);

	function loadLocalWordsData(data: PiecesType) {
		dispatch({ type: 'loadFromStorage', payload: data });
	}

	let isLoading = useReadLocalStorage<PiecesType>('pieces', loadLocalWordsData);

	// write changes to local storage
	React.useEffect(() => {
		updateLocalStorage<PiecesType>('save', 'pieces', pieces);
	}, [pieces]);

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

	let value = React.useMemo(() => ({ isLocalDataLoading: isLoading, addIPA, removeIPA, pieces }), [addIPA, isLoading, removeIPA, pieces]);

	return <WordsContext.Provider value={value}>{children}</WordsContext.Provider>;
}

export default WordsProvider;
