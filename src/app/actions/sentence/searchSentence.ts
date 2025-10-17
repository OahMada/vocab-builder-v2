'use server';

import { unstable_cache } from 'next/cache';
import { Document } from 'mongodb';

import prisma from '@/lib/prisma';
import { SearchSentencesInputSchema, SentenceWithPieces, CountSearchResultSchema } from '@/lib';
import { handleZodError } from '@/utils';
import { SENTENCE_FETCHING_LIMIT, UNSTABLE_CACHE_TAG } from '@/constants';

type SearchResultsWithPaginationToken = SentenceWithPieces & { paginationToken: string };

function compoundOperatorOption(search: string, userId: string) {
	return {
		compound: {
			filter: [
				{
					equals: {
						// https://github.com/prisma/prisma/issues/15013#issuecomment-1381397966
						value: { $oid: userId },
						path: 'userId',
					},
				},
			],
			should: [{ autocomplete: { query: search, path: 'sentence', tokenOrder: 'any' } }, { text: { query: search, path: 'sentence' } }],
			minimumShouldMatch: 1,
		},
	};
}

function buildSearchPipeline(search: string, userId: string, nextCursor?: string) {
	let databaseIndexName = process.env.DATABASE_INDEX_NAME;
	if (!databaseIndexName) throw new Error('Database index name not found');
	let searchStage: Document = {
		$search: {
			index: databaseIndexName,
			...compoundOperatorOption(search, userId),
			sort: {
				score: {
					$meta: 'searchScore',
				},
			},
		},
	};

	if (nextCursor) {
		searchStage.$search.searchAfter = nextCursor;
	}

	return [
		searchStage,
		{
			$addFields: {
				id: { $toString: '$_id' },
			},
		},
		{
			$lookup: {
				from: 'Piece',
				localField: '_id',
				foreignField: 'sentenceId',
				as: 'pieces',
			},
		},
		{
			$addFields: {
				pieces: {
					$map: {
						input: '$pieces',
						as: 'p',
						in: {
							id: '$$p._id', // map _id to id
							word: '$$p.word',
							IPA: '$$p.IPA',
							index: '$$p.index',
						},
					},
				},
			},
		},
		{ $limit: SENTENCE_FETCHING_LIMIT + 1 },
		{
			$project: {
				paginationToken: { $meta: 'searchSequenceToken' },
				createdAt: 0,
				updatedAt: 0,
				_id: 0,
				userId: 0,
			},
		},
	];
}

export var searchSentences = unstable_cache(
	async function (data: unknown): Promise<{ error: string } | { data: SentenceWithPieces[]; nextCursor: string | null }> {
		let result = SearchSentencesInputSchema.safeParse(data);
		if (!result.success) {
			let error = handleZodError(result.error, 'prettify');
			return { error };
		}
		let { search, cursor, limit, userId } = result.data;

		try {
			let pipeline = buildSearchPipeline(search, userId, cursor);
			let searchResult = (await prisma.sentence.aggregateRaw({
				pipeline,
			})) as unknown as SearchResultsWithPaginationToken[];

			let nextCursor: string | null = null;
			if (searchResult.length > limit) {
				searchResult.pop();
				let nextItem = searchResult.at(-1);
				nextCursor = nextItem!.paginationToken;
			}

			// no need to return all the paginationTokens
			let sentences: SentenceWithPieces[] = searchResult.map((item) => {
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				let { paginationToken, ...rest } = item;
				return rest;
			});

			return { data: sentences, nextCursor };
		} catch (error) {
			console.error('could not perform search action', error);
			return { error: 'Failed to search, please try again later' };
		}
	},
	[],
	{ revalidate: 3600, tags: [UNSTABLE_CACHE_TAG.SENTENCES] }
);

export var countSearchResults = unstable_cache(
	async function (data: unknown): Promise<{ error: string } | { data: number }> {
		let result = CountSearchResultSchema.safeParse(data);
		if (!result.success) {
			let error = handleZodError(result.error, 'prettify');
			return { error };
		}

		let { search, userId } = result.data;

		try {
			let databaseIndexName = process.env.DATABASE_INDEX_NAME;
			if (!databaseIndexName) throw new Error('Database index name not found');
			let result = (await prisma.sentence.aggregateRaw({
				pipeline: [
					{
						$searchMeta: {
							index: databaseIndexName,
							...compoundOperatorOption(search, userId),
							count: {
								type: 'total',
							},
						},
					},
				],
			})) as unknown as [{ count: { total: number } }];

			return { data: result[0].count.total };
		} catch (error) {
			console.error('could not count search results', error);
			return { error: 'Failed to count the amount of search results' };
		}
	},
	[],
	{ revalidate: 3600, tags: [UNSTABLE_CACHE_TAG.SENTENCES] }
);
