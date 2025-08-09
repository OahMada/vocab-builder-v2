export type Word =
	| {
			id: string;
			piece: string;
			isWord: true;
			IPA: string;
	  }
	| {
			id: string;
			piece: string;
			isWord: false;
	  };

export type WordsType = Word[];

export interface WordsIPAContextType {
	words: WordsType;
	isLoadingLocalData: boolean;
	addIPA: (word: string, IPA: string) => void;
	removeIPA: (word: string) => void;
}

export type Action =
	| {
			type: 'addIPA';
			payload: {
				word: string;
				IPA: string;
			};
	  }
	| {
			type: 'removeIPA';
			payload: string;
	  }
	| { type: 'loadFromStorage'; payload: WordsType };
