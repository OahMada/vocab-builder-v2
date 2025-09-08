import * as React from 'react';
import { unstable_cache } from 'next/cache';
import { SearchParams } from 'nuqs';
import SentenceListing from '@/components/SentenceListing';
import readAllSentences from '@/app/actions/sentence/readAllSentences';
import { UNSTABLE_CACHE_TAG } from '@/constants';
import { SentenceWithPieces } from '@/lib/sentenceReadSelect';
import { searchParamsCache } from '@/lib/searchParamsCache';

var getCachedSentences = unstable_cache(
	async () => {
		return await readAllSentences();
	},
	[],
	{ revalidate: 3600, tags: [UNSTABLE_CACHE_TAG] }
);

export default async function BrowseList({ searchParams }: { searchParams: Promise<SearchParams> }) {
	let { search } = searchParamsCache.parse(await searchParams);

	if (search) {
		return null;
	}

	let initialError: string | undefined = undefined;
	let sentences: SentenceWithPieces[] = [];
	let cursor: string | undefined = undefined;
	let result = await getCachedSentences();
	if ('error' in result) {
		initialError = result.error;
	} else if ('data' in result) {
		sentences = result.data;
		cursor = result.nextCursor ?? undefined;
	}
	return <SentenceListing sentences={sentences} cursor={cursor} initialError={initialError} />;
}
