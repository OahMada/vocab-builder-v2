import * as React from 'react';
import { SearchParams } from 'nuqs';

import { readAllSentences, countSentences } from '@/app/actions/sentence/readAllSentences';

import { SentenceWithPieces } from '@/lib/prismaSelect';
import searchParamsCache from '@/lib/searchParamsCache';
import { auth } from '@/auth';
import { SENTENCE_FETCHING_LIMIT } from '@/constants';

import SentenceListing from '@/components/SentenceListing';
import UnauthorizedDisplay from '@/components/UnauthorizedDisplay';
import InnerWidthWrapper from '@/components/InnerWidthWrapper';

export default async function BrowseList({ searchParams }: { searchParams: Promise<SearchParams> }) {
	let { search } = searchParamsCache.parse(await searchParams);
	if (search) {
		return null;
	}
	let session = await auth();

	if (!session?.user) {
		return <UnauthorizedDisplay callback='/browse' />;
	}
	let userId = session.user.id;

	let dataError: string | undefined = undefined;
	let sentences: SentenceWithPieces[] = [];
	let cursor: string | undefined = undefined;
	let count: number = 0;
	let countError: string | undefined = undefined;
	let [dataResult, countResult] = await Promise.allSettled([readAllSentences({ userId, limit: SENTENCE_FETCHING_LIMIT }), countSentences(userId)]);
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

	let countMessage: string;
	if (countError) {
		countMessage = countError;
	} else {
		countMessage = `There are ${count} sentences in total.`;
	}

	return (
		<InnerWidthWrapper>
			<SentenceListing sentences={sentences} cursor={cursor} initialError={dataError} countMessage={countMessage} hasCountError={!!countError} />
		</InnerWidthWrapper>
	);
}
