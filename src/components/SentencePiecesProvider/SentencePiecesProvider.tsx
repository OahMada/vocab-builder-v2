'use client';

import * as React from 'react';
import { produce } from 'immer';

import { PiecesType } from '@/types';
import { constructSentencePiecesData, segmentSentence } from '@/helpers';
import { SentenceWithPieces } from '@/lib';
import { Action, RemoveIPAParams, AddIPAParams } from './types';
import SentencePiecesContext from './SentencePiecesContext';

function reducer(state: PiecesType, action: Action) {
	return produce(state, (draft) => {
		switch (action.type) {
			case 'addIPA':
				let { word, IPA } = action.payload;
				for (let item of draft) {
					if (typeof item !== 'string' && item.word === word.text && item.id === word.id) {
						item.IPA = IPA;
					}
				}
				break;
			case 'removeIPA':
				for (let item of draft) {
					let { word, id } = action.payload;
					if (typeof item !== 'string' && item.word === word && item.id === id) {
						item.IPA = undefined;
					}
				}
				break;

			case 'loadFromStorage':
				return action.payload;
		}
	});
}

function SentencePiecesProvider({
	databasePieces,
	sentence,
	children,
}: {
	databasePieces?: SentenceWithPieces['pieces'];
	sentence: string;
	children: React.ReactNode;
}) {
	let defaultState: PiecesType = segmentSentence(sentence);
	let state: PiecesType | undefined = undefined;
	if (databasePieces) {
		state = constructSentencePiecesData(sentence, databasePieces);
	}

	let [pieces, dispatch] = React.useReducer(reducer, state || defaultState);

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

	let value = React.useMemo(() => ({ addIPA, removeIPA, pieces }), [addIPA, removeIPA, pieces]);

	return <SentencePiecesContext.Provider value={value}>{children}</SentencePiecesContext.Provider>;
}

export default SentencePiecesProvider;
