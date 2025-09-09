import * as React from 'react';
import SentenceListing from '@/components/SentenceListing';
import { searchSentences, countSearchResults } from '@/app/actions/sentence/searchSentence';
import { markSearchMatchesInSentencePieces } from '@/helpers';
import { SentenceWithHighlightedPieces } from '@/types';
import { SearchParams } from 'nuqs/server';
import { searchParamsCache } from '@/lib/searchParamsCache';
import { NoticeText } from '../StyledComponents';

export default async function SearchList({ searchParams }: { searchParams: Promise<SearchParams> }) {
	let { search } = searchParamsCache.parse(await searchParams);

	if (!search) {
		return null;
	}

	let dataError: string | undefined = undefined;
	let sentences: SentenceWithHighlightedPieces[] = [];
	let cursor: string | undefined = undefined;
	let count: number = 0;
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

	return (
		<>
			<NoticeText $hasError={!!countError}>{countError ? countError : `Found ${count} matching sentences in total.`}</NoticeText>
			<SentenceListing sentences={sentences} cursor={cursor} initialError={dataError} />
		</>
	);
}
