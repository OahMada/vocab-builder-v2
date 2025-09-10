import * as React from 'react';
import SentenceListing from '@/components/SentenceListing';
import { searchSentences, countSearchResults } from '@/app/actions/sentence/searchSentence';
import { SearchParams } from 'nuqs/server';
import { searchParamsCache } from '@/lib/searchParamsCache';
import { SentenceWithPieces } from '@/lib';
import { markSearchMatchesInSentencePieces } from '@/helpers';

export default async function SearchList({ searchParams }: { searchParams: Promise<SearchParams> }) {
	let { search } = searchParamsCache.parse(await searchParams);

	if (!search) {
		return null;
	}

	let dataError: string | undefined = undefined;
	let sentences: SentenceWithPieces[] = [];
	let cursor: string | undefined = undefined;
	let count: number | undefined = undefined;
	let countError: string | undefined = undefined;
	let [dataResult, countResult] = await Promise.allSettled([searchSentences({ search }), countSearchResults(search)]);
	if (dataResult.status === 'fulfilled') {
		let value = dataResult.value;
		if ('error' in value) {
			dataError = value.error;
		} else if ('data' in value) {
			sentences = markSearchMatchesInSentencePieces(value.data, search);
			cursor = value.nextCursor ?? undefined;
		}
	}
	if (countResult.status === 'fulfilled') {
		let value = countResult.value;
		if ('error' in value) {
			countError = value.error;
		} else if ('data' in value) {
			count = value.data;
		}
	}

	let countMessage: string;
	if (countError) {
		countMessage = countError;
	} else {
		countMessage = `Found ${count} matching sentences in total.`;
	}

	return (
		<SentenceListing
			sentences={sentences}
			cursor={cursor}
			initialError={dataError}
			key={search}
			countMessage={countMessage}
			hasCountError={!!countError}
		/>
	);
}
