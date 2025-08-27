import * as React from 'react';
import { SentenceWithPieces } from '@/lib';
import { segmentSentence } from '@/helpers';
import WordWithPhoneticSymbol from '@/components/WordWithPhoneticSymbol';

export function useConstructedSentence(wholeSentence: string, pieces: SentenceWithPieces['pieces']) {
	let result = segmentSentence(wholeSentence);
	let piecesMap = new Map(pieces.map((item) => [item.word, item]));

	let constructedSentence: React.ReactNode[] = [];

	for (let item of result) {
		if (typeof item === 'string') {
			constructedSentence.push(item);
		} else {
			let match = piecesMap.get(item.word);
			if (match) {
				if (!match.IPA) {
					constructedSentence.push(item.word);
				} else {
					let wordEle = (
						<WordWithPhoneticSymbol key={match.id} symbol={match.IPA}>
							{match.word}
						</WordWithPhoneticSymbol>
					);
					constructedSentence.push(wordEle);
				}
			}
		}
	}

	return constructedSentence;
}
