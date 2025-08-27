import { PiecesType, Piece } from '@/components/WordsProvider';
import { createId } from '@paralleldrive/cuid2';

function segmentSentence(sentence: string): PiecesType {
	let segmenter = new Intl.Segmenter([], { granularity: 'word' });
	let segmentedText = Array.from(segmenter.segment(sentence), (item): Piece => {
		if (item.isWordLike) {
			return {
				id: createId(),
				piece: item.segment,
				IPA: undefined,
			};
		} else {
			return item.segment;
		}
	});
	return segmentedText;
}

export { segmentSentence };
