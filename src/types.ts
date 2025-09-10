export type Piece =
	| {
			id: string;
			word: string;
			IPA?: string;
	  }
	| string;

export type PiecesType = Piece[];
