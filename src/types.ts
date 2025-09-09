import { SentenceWithPieces } from '@/lib';

export interface Highlight {
	path: string;
	score: number;
	texts: {
		value: string;
		type: 'text' | 'hit';
	}[];
}

export type SearchResults = SentenceWithPieces & { highlights: Highlight[] };

export type SentenceWithHighlightedPieces = Omit<SentenceWithPieces, 'pieces'> & {
	pieces: (SentenceWithPieces['pieces'][number] & { isSearchMatch?: boolean })[];
};

export type Piece =
	| {
			id: string;
			word: string;
			IPA?: string;
	  }
	| string;

export type PiecesType = Piece[];
