import { createId } from '@paralleldrive/cuid2';

import { PiecesType, Piece } from '@/types';

function segmentSentence(sentence: string): PiecesType {
	let segmenter = new Intl.Segmenter([], { granularity: 'word' });
	let segmentedText = Array.from(segmenter.segment(sentence), (item, index): Piece => {
		if (item.isWordLike) {
			return {
				id: createId(),
				word: item.segment,
				IPA: undefined,
				index,
			};
		} else {
			return item.segment;
		}
	});
	return segmentedText;
}

export { segmentSentence };
