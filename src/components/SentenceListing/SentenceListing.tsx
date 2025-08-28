import * as React from 'react';
import { unstable_cache } from 'next/cache';
import { SentenceWithPieces } from '@/lib';
import ErrorDisplay from './ErrorDisplay';
import OptimisticSentenceListing from '@/components/OptimisticSentenceListing';
import readAllSentences from '@/app/actions/sentence/readAllSentences';

// TODO put a suspense boundary around this element

const getCachedSentences = unstable_cache(
	async () => {
		return await readAllSentences();
	},
	[],
	{ revalidate: 3600, tags: ['sentences'] }
);

async function SentenceListing() {
	let sentences: SentenceWithPieces[];
	// throw new Error('test');
	let result = await getCachedSentences();
	if ('error' in result) {
		return <ErrorDisplay />;
	}
	sentences = result.data;
	return <OptimisticSentenceListing sentences={sentences} />;
}

export default SentenceListing;
