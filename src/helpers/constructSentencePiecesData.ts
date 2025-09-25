import { Piece } from '@prisma/client';

import { PiecesType } from '@/types';
import { SentenceWithPieces } from '@/lib';
import { segmentSentence } from './segmentSentence';

export function constructSentencePiecesData(wholeSentence: string, pieces: SentenceWithPieces['pieces']) {
	let result = segmentSentence(wholeSentence);
	let piecesMap: [string, Omit<Piece, 'sentenceId'>][] = pieces.map((item) => [item.word, item]);

	let constructedSentencePiecesData: PiecesType = [];

	for (let item of result) {
		if (typeof item === 'string') {
			constructedSentencePiecesData.push(item);
		} else {
			let index = piecesMap.findIndex((piece) => piece[0] === item.word);
			if (index !== -1) {
				let matchedPiece = piecesMap[index][1];
				if (!matchedPiece.IPA) {
					constructedSentencePiecesData.push(item);
				} else {
					constructedSentencePiecesData.push({ ...item, IPA: matchedPiece.IPA });
				}
				// remove already matched word to deal with duplications
				piecesMap = [...piecesMap.slice(0, index), ...piecesMap.slice(index + 1)];
			}
		}
	}
	return constructedSentencePiecesData;
}
