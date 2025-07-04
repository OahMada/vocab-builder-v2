interface SegmentedSentence extends Intl.SegmentData {
	id: string;
}

function segmentSentence(sentence: string): SegmentedSentence[] {
	let segmenter = new Intl.Segmenter([], { granularity: 'word' });
	let segmentedText = Array.from(segmenter.segment(sentence), (item) => {
		return { ...item, id: crypto.randomUUID() };
	});

	return segmentedText;
}

export { segmentSentence };
