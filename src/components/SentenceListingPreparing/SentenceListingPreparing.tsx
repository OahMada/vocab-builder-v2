import * as React from 'react';
import { unstable_cache } from 'next/cache';
import SentenceListing from '@/components/SentenceListing';
import readAllSentences from '@/app/actions/sentence/readAllSentences';
import { UNSTABLE_CACHE_TAG } from '@/constants';
import { SentenceWithPieces } from '@/lib';

// TODO put a suspense boundary around this element

var getCachedSentences = unstable_cache(
	async () => {
		return await readAllSentences();
	},
	[],
	{ revalidate: 3600, tags: [UNSTABLE_CACHE_TAG] }
);

async function SentenceListingPreparing() {
	let result = await getCachedSentences();

	let initialError: string | undefined = undefined;
	let sentences: SentenceWithPieces[] = [];
	let cursor: string | undefined = undefined;
	if ('error' in result) {
		initialError = result.error;
	} else if ('data' in result) {
		sentences = result.data;
		cursor = result.nextCursor ?? undefined;
	}
	return <SentenceListing sentences={sentences} cursor={cursor} initialError={initialError} />;
}

export default SentenceListingPreparing;
