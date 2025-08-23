import * as React from 'react';
import { SentenceWithPieces } from '@/lib';
import { segmentSentence } from '@/helpers';
import WordWithPhoneticSymbol from '@/components/WordWithPhoneticSymbol';

export function useConstructedSentence(wholeSentence: string, words: SentenceWithPieces['pieces']) {
	let result = segmentSentence(wholeSentence);
	let wordsMap = new Map(words.map((item) => [item.piece, item]));

	let constructedSentence: React.ReactNode[] = [];

	for (let item of result) {
		if (typeof item === 'string') {
			constructedSentence.push(item);
		} else {
			let match = wordsMap.get(item.piece);
			if (match) {
				if (!match.IPA) {
					constructedSentence.push(item.piece);
				} else {
					let wordEle = (
						<WordWithPhoneticSymbol key={match.id} symbol={match.IPA}>
							{match.piece}
						</WordWithPhoneticSymbol>
					);
					constructedSentence.push(wordEle);
				}
			}
		}
	}

	return constructedSentence;
}
