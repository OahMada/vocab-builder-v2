// This file is used to merge search result highlight data into sentence pieces, adding an extra isSearchMatch field.

import { PieceWithSearchMatch } from '@/types';
import { PiecesType } from '@/types';

export function markSearchMatchesInSentencePieces(data: PiecesType, search: string): PieceWithSearchMatch[] {
	let queryTokens = search
		.toLowerCase()
		.split(/[^a-z0-9]+/) // split on anything not a-z or 0-9
		.filter(Boolean);

	return data.map((piece) => {
		if (typeof piece === 'string') return piece;
		for (let token of queryTokens) {
			if (piece.word.toLowerCase().includes(token)) {
				return {
					...piece,
					isSearchMatch: true,
				};
			}
		}
		return piece;
	});
}
