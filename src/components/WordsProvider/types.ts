export type Word =
	| {
			id: string;
			piece: string;
			isWord: true;
			IPA: string | undefined;
	  }
	| {
			id: string;
			piece: string;
			isWord: false;
	  };

export type WordsType = Word[];

export interface AddIPAParams {
	text: string;
	IPA: string;
	id: string;
}

export interface RemoveIPAParams {
	word: string;
	id: string;
}

export interface WordsContextType {
	words: WordsType;
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
	| { type: 'loadFromStorage'; payload: WordsType };
