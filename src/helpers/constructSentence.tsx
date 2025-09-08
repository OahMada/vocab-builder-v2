import * as React from 'react';
import { Piece } from '@prisma/client';
import { segmentSentence } from '@/helpers';
import WordWithPhoneticSymbol from '@/components/WordWithPhoneticSymbol';
import { SentenceWithHighlightedPieces } from '@/types';
import SearchMatchedWord from '@/components/SearchMatchedWord';

export function constructSentence(wholeSentence: string, pieces: SentenceWithHighlightedPieces['pieces']) {
	let result = segmentSentence(wholeSentence);
	let piecesMap: [string, Omit<Piece & { isSearchMatch?: boolean }, 'sentenceId'>][] = pieces.map((item) => [item.word, item]);
	let constructedSentence: React.ReactNode[] = [];

	for (let item of result) {
		if (typeof item === 'string') {
			// whitespaces, punctuations
			constructedSentence.push(item);
		} else {
			let index = piecesMap.findIndex((piece) => piece[0] === item.word);
			if (index !== -1) {
				let matchedPiece = piecesMap[index][1];

				if (!matchedPiece.IPA) {
					// word with IPA
					if (matchedPiece.isSearchMatch) {
						constructedSentence.push(<SearchMatchedWord key={item.id}>{item.word}</SearchMatchedWord>);
					} else {
						constructedSentence.push(item.word);
					}
				} else {
					// word without IPA
					let wordEle: React.ReactNode;

					if (matchedPiece.isSearchMatch) {
						wordEle = (
							<WordWithPhoneticSymbol key={item.id} symbol={matchedPiece.IPA}>
								<SearchMatchedWord>{item.word}</SearchMatchedWord>
							</WordWithPhoneticSymbol>
						);
					} else {
						wordEle = (
							<WordWithPhoneticSymbol key={item.id} symbol={matchedPiece.IPA}>
								{item.word}
							</WordWithPhoneticSymbol>
						);
					}
					constructedSentence.push(wordEle);
				}
				// remove already matched word to deal with duplications
				piecesMap = [...piecesMap.slice(0, index), ...piecesMap.slice(index + 1)];
			}
		}
	}

	return constructedSentence;
}
