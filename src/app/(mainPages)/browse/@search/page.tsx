import * as React from 'react';
import SentenceListing from '@/components/SentenceListing';
import searchSentences from '@/app/actions/sentence/searchSentence';
import { markSearchMatchesInSentencePieces } from '@/helpers';
import { SentenceWithHighlightedPieces } from '@/types';
import { SearchParams } from 'nuqs/server';
import { searchParamsCache } from '@/lib/searchParamsCache';

export default async function SearchList({ searchParams }: { searchParams: Promise<SearchParams> }) {
	let { search } = searchParamsCache.parse(await searchParams);

	if (!search) {
		return null;
	}

	let initialError: string | undefined = undefined;
	let sentences: SentenceWithHighlightedPieces[] = [];
	let cursor: string | undefined = undefined;
	let result = await searchSentences({ search });
	if ('error' in result) {
		initialError = result.error;
	} else if ('data' in result) {
		sentences = markSearchMatchesInSentencePieces(result.data, search);
		cursor = result.nextCursor ?? undefined;
	}

	return <SentenceListing sentences={sentences} cursor={cursor} initialError={initialError} />;
}
