import { SearchResults, SentenceWithHighlightedPieces, Highlight } from '@/types';

// This file is used to merge search result highlight data into sentence pieces, adding an extra isSearchMatch field.

function extractHitsFromHighlights(highlights?: Highlight[]): string[] {
	if (!highlights) return [];

	let hits: string[] = [];
	for (let item of highlights) {
		for (let t of item.texts) {
			if (t.type === 'hit') hits.push(t.value);
		}
	}
	return hits;
}

// TODO more than one word in query
export function markSearchMatchesInSentencePieces(data: SearchResults[], search: string): SentenceWithHighlightedPieces[] {
	let query = search.toLowerCase();

	return data.map(({ highlights, ...rest }) => {
		let hits = new Set(extractHitsFromHighlights(highlights).map((h) => h.toLowerCase()));

		let pieces = rest.pieces.map((piece) => {
			if (hits.has(piece.word.toLowerCase()) && piece.word.toLowerCase().includes(query)) {
				return {
					...piece,
					isSearchMatch: true,
				};
			}
			return piece;
		});

		return {
			...rest,
			pieces,
		};
	});
}
