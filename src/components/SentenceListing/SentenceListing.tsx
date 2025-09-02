import * as React from 'react';
import { unstable_cache } from 'next/cache';
import ErrorDisplay from './ErrorDisplay';
import OptimisticSentenceListing from '@/components/OptimisticSentenceListing';
import readAllSentences from '@/app/actions/sentence/readAllSentences';
import { UNSTABLE_CACHE_TAG } from '@/constants';

// TODO put a suspense boundary around this element

var getCachedSentences = unstable_cache(
	async () => {
		return await readAllSentences();
	},
	[],
	{ revalidate: 3600, tags: [UNSTABLE_CACHE_TAG] }
);

async function SentenceListing() {
	let result = await getCachedSentences();
	// result = { error: 'hello' };
	if ('error' in result) {
		return <ErrorDisplay />;
	}
	let sentences = result.data;
	let cursor = result.nextCursor;
	return <OptimisticSentenceListing sentences={sentences} cursor={cursor ?? undefined} />;
}

export default SentenceListing;
