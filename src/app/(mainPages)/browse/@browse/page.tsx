import * as React from 'react';
import { SearchParams } from 'nuqs';
import SentenceListing from '@/components/SentenceListing';
import { readAllSentences, countSentences } from '@/app/actions/sentence/readAllSentences';
import { SentenceWithPieces } from '@/lib/sentenceReadSelect';
import { searchParamsCache } from '@/lib/searchParamsCache';
import { NoticeText } from '../StyledComponents';

export default async function BrowseList({ searchParams }: { searchParams: Promise<SearchParams> }) {
	let { search } = searchParamsCache.parse(await searchParams);

	if (search) {
		return null;
	}

	let dataError: string | undefined = undefined;
	let sentences: SentenceWithPieces[] = [];
	let cursor: string | undefined = undefined;
	let count: number = 0;
	let countError: string | undefined = undefined;
	let [dataResult, countResult] = await Promise.allSettled([readAllSentences(), countSentences()]);
	if (dataResult.status === 'fulfilled') {
		let value = dataResult.value;
		if ('error' in value) {
			dataError = value.error;
		} else if ('data' in value) {
			sentences = value.data;
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
			<NoticeText $hasError={!!countError}>{countError ? countError : `There are ${count} sentences in total.`}</NoticeText>
			<SentenceListing sentences={sentences} cursor={cursor} initialError={dataError} />
		</>
	);
}
