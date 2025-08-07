'use client';

import * as React from 'react';
import { produce } from 'immer';
import { useReadLocalStorage } from '@/hooks';
import { updateLocalStorage } from '@/helpers';

type Word =
	| {
			piece: string;
			isWord: true;
			IPA: string;
	  }
	| {
			piece: string;
			isWord: false;
	  };

interface SentenceData {
	sentence: string;
	translation: string;
	note: string;
	words: Word[];
}

type Action =
	| {
			type: 'updateNote' | 'updateWords' | 'updateTranslation' | 'updateSentence';
			payload: string;
	  }
	| { type: 'load'; payload: SentenceData };

interface SentenceDataContextType {
	isLocalDataLoading: boolean;
	sentenceData: SentenceData;
	updateSentence: (sentence: string) => void;
	updateWords: (word: string) => void;
	updateTranslation: (translation: string) => void;
	updateNote: (note: string) => void;
}

var defaultData = {
	sentence: '',
	translation: '',
	words: [],
	note: '',
};

function reducer(state: SentenceData, action: Action) {
	return produce(state, (draft) => {
		switch (action.type) {
			case 'updateSentence':
				break;
			case 'updateWords':
				break;
			case 'updateTranslation':
				draft.translation = action.payload;
				break;
			case 'updateNote':
				break;
			case 'load':
				return action.payload;
		}
	});
}

export var SentenceDataContext = React.createContext<SentenceDataContextType | null>(null);

function SentenceDataProvider({ children }: { children: React.ReactNode }) {
	let [savedSentenceDataRef, loadingLocalDataRef] = useReadLocalStorage<SentenceData>('sentence-data');
	let [sentenceData, dispatch] = React.useReducer(reducer, defaultData);

	// load previously saved data
	React.useEffect(() => {
		if (savedSentenceDataRef.current) {
			dispatch({ type: 'load', payload: savedSentenceDataRef.current });
		}
	}, [savedSentenceDataRef]);

	// write changes to local storage
	React.useEffect(() => {
		updateLocalStorage<SentenceData>('save', 'sentence-data', sentenceData);
	}, [sentenceData]);

	function updateTranslation(translation: string) {
		dispatch({ type: 'updateTranslation', payload: translation });
	}

	function updateSentence(sentence: string) {
		dispatch({ type: 'updateSentence', payload: sentence });
	}
	function updateWords(word: string) {
		dispatch({ type: 'updateTranslation', payload: word });
	}
	function updateNote(note: string) {
		dispatch({ type: 'updateTranslation', payload: note });
	}

	let value = React.useMemo(
		() => ({
			isLocalDataLoading: loadingLocalDataRef.current,
			sentenceData,
			updateSentence,
			updateWords,
			updateTranslation,
			updateNote,
		}),
		[loadingLocalDataRef, sentenceData]
	);

	return <SentenceDataContext.Provider value={value}>{children}</SentenceDataContext.Provider>;
}
export default SentenceDataProvider;

export function useSentenceDataProvider() {
	let result = React.useContext(SentenceDataContext);
	if (!result) {
		throw new Error('useSentenceDataProvider has to be used within <SentenceDataContext.Provider>');
	}
	return result;
}
