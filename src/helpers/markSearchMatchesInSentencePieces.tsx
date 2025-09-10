// This file is used to merge search result highlight data into sentence pieces, adding an extra isSearchMatch field.

import { SentenceWithPieces } from '@/lib';

export function markSearchMatchesInSentencePieces(data: SentenceWithPieces[], search: string): SentenceWithPieces[] {
	let queryTokens = search
		.toLowerCase()
		.split(/[^a-z0-9]+/) // split on anything not a-z or 0-9
		.filter(Boolean);

	console.log('queryTokens', queryTokens);

	return data.map((item) => {
		let pieces = item.pieces.map((piece) => {
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

		return {
			...item,
			pieces,
		};
	});
}
