import { WordsType, Word } from '@/components/WordsProvider';
import cuid from 'cuid';

function segmentSentence(sentence: string): WordsType {
	let segmenter = new Intl.Segmenter([], { granularity: 'word' });
	let segmentedText = Array.from(segmenter.segment(sentence), (item): Word => {
		if (item.isWordLike) {
			return {
				id: cuid(),
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
