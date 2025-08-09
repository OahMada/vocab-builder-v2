import { WordsType, Word } from '@/components/WordsIPAProvider';

function segmentSentence(sentence: string): WordsType {
	let segmenter = new Intl.Segmenter([], { granularity: 'word' });
	let segmentedText = Array.from(segmenter.segment(sentence), (item): Word => {
		if (item.isWordLike) {
			return {
				id: crypto.randomUUID(),
				piece: item.segment,
				isWord: true,
				IPA: '',
			};
		} else {
			return {
				id: crypto.randomUUID(),
				piece: item.segment,
				isWord: false,
			};
		}
	});
	return segmentedText;
}

export { segmentSentence };
