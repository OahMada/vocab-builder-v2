import { Piece } from '@prisma/client';

import { PiecesType } from '@/types';
import { SentenceWithPieces } from '@/lib';
import { segmentSentence } from './segmentSentence';

export function constructSentencePiecesData(wholeSentence: string, pieces: SentenceWithPieces['pieces']): PiecesType {
	let result = segmentSentence(wholeSentence);
	let piecesMap: Map<number, Omit<Piece, 'sentenceId'>> = new Map(pieces.map((item) => [item.index, item]));

	let constructedSentencePiecesData: PiecesType = [];

	for (let item of result) {
		if (typeof item === 'string') {
			constructedSentencePiecesData.push(item);
		} else {
			let matchedPiece = piecesMap.get(item.index);
			if (matchedPiece) {
				constructedSentencePiecesData.push(matchedPiece);
			} else {
				constructedSentencePiecesData.push(item);
			}
		}
	}
	return constructedSentencePiecesData;
}
