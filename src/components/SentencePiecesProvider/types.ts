import { PiecesType } from '@/types';

export interface AddIPAParams {
	text: string;
	IPA: string;
	id: string;
}

export interface RemoveIPAParams {
	word: string;
	id: string;
}

export interface SentencePiecesContextType {
	pieces: PiecesType;
	isLocalDataLoading: boolean;
	addIPA: ({ text, IPA, id }: AddIPAParams) => void;
	removeIPA: ({ word, id }: RemoveIPAParams) => void;
}

export type Action =
	| {
			type: 'addIPA';
			payload: {
				word: {
					text: string;
					id: string;
				};
				IPA: string;
			};
	  }
	| {
			type: 'removeIPA';
			payload: {
				word: string;
				id: string;
			};
	  }
	| { type: 'loadFromStorage'; payload: PiecesType };
