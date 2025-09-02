import * as React from 'react';
import { Piece } from '@prisma/client';
import { SentenceWithPieces } from '@/lib';
import { segmentSentence } from '@/helpers';
import WordWithPhoneticSymbol from '@/components/WordWithPhoneticSymbol';

export function useConstructedSentence(wholeSentence: string, pieces: SentenceWithPieces['pieces']) {
	let result = segmentSentence(wholeSentence);
	let piecesMap: [string, Omit<Piece, 'sentenceId'>][] = pieces.map((item) => [item.word, item]);
	let constructedSentence: React.ReactNode[] = [];

	for (let item of result) {
		if (typeof item === 'string') {
			constructedSentence.push(item);
		} else {
			let index = piecesMap.findIndex((piece) => piece[0] === item.word);
			if (index !== -1) {
				let matchedPiece = piecesMap[index][1];
				if (!matchedPiece.IPA) {
					constructedSentence.push(item.word);
				} else {
					let wordEle = (
						<WordWithPhoneticSymbol key={item.id} symbol={matchedPiece.IPA}>
							{item.word}
						</WordWithPhoneticSymbol>
					);
					constructedSentence.push(wordEle);
				}
				// remove already matched word to deal with duplications
				piecesMap = [...piecesMap.slice(0, index), ...piecesMap.slice(index + 1)];
			}
		}
	}

	return constructedSentence;
}
