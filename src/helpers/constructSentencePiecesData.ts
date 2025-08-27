import { PiecesType } from '@/components/WordsProvider/types';
import { segmentSentence } from './segmentSentence';
import { SentenceWithPieces } from '@/lib';

export function constructSentencePiecesData(wholeSentence: string, pieces: SentenceWithPieces['pieces']) {
	let result = segmentSentence(wholeSentence);
	let piecesMap = new Map(pieces.map((item) => [item.piece, item]));

	let constructedSentencePiecesData: PiecesType = [];

	for (let item of result) {
		if (typeof item === 'string') {
			constructedSentencePiecesData.push(item);
		} else {
			let match = piecesMap.get(item.piece);
			if (match) {
				if (!match.IPA) {
					constructedSentencePiecesData.push(item);
				} else {
					constructedSentencePiecesData.push({ ...item, IPA: match.IPA });
				}
			}
		}
	}
	return constructedSentencePiecesData;
}
