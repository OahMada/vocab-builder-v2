'use server';

import { unstable_cache } from 'next/cache';
import prisma from '@/lib/prisma';
import { SearchSentencesInputSchema } from '@/lib';
import { handleZodError } from '@/utils';
import { SENTENCE_FETCHING_LIMIT, UNSTABLE_CACHE_TAG } from '@/constants';
import { Document } from 'mongodb';
import { SearchResults } from '@/types';

type SearchResultsWithPaginationToken = SearchResults & { paginationToken: string };

function buildSearchPipeline(search: string, nextCursor?: string) {
	let databaseIndexName = process.env.DATABASE_INDEX_NAME;
	if (!databaseIndexName) throw new Error('Database index name not found');
	let searchStage: Document = {
		$search: {
			index: databaseIndexName,
			text: { query: search, path: 'sentence' },
			highlight: { path: 'sentence' },
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
		{ $limit: SENTENCE_FETCHING_LIMIT + 1 },
		{
			$project: {
				highlights: { $meta: 'searchHighlights' },
				paginationToken: { $meta: 'searchSequenceToken' },
				createdAt: 0,
				updatedAt: 0,
				_id: 0,
			},
		},
	];
}

export var searchSentences = unstable_cache(
	async function (data: unknown): Promise<{ error: string } | { data: SearchResults[]; nextCursor: string | null }> {
		let result = SearchSentencesInputSchema.safeParse(data);
		if (!result.success) {
			let error = handleZodError(result.error, 'prettify');
			return { error: error };
		}
		let { search, cursor, limit } = result.data;

		try {
			let pipeline = buildSearchPipeline(search, cursor);
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
			let sentences: SearchResults[] = searchResult.map((item) => {
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				let { paginationToken, ...rest } = item;
				return rest;
			});

			// return { error: 'Failed to search sentences' };
			return { data: sentences, nextCursor };
		} catch (error) {
			console.error('could not perform search action', error);
			return { error: 'Failed to search, please try again later.' };
		}
	},
	[],
	{ revalidate: 3600, tags: [UNSTABLE_CACHE_TAG] }
);

export var countSearchResults = unstable_cache(
	async function (data: unknown): Promise<{ error: string } | { data: number }> {
		let result = SearchSentencesInputSchema.shape.search.safeParse(data);
		if (!result.success) {
			let errors = handleZodError(result.error);
			return { error: errors.formErrors[0] as string };
		}

		let search = result.data;

		try {
			let databaseIndexName = process.env.DATABASE_INDEX_NAME;
			if (!databaseIndexName) throw new Error('Database index name not found');
			let result = (await prisma.sentence.aggregateRaw({
				pipeline: [
					{
						$searchMeta: {
							index: databaseIndexName,
							text: { query: search, path: 'sentence' },
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
			return { error: 'Failed to count the amount of search results.' };
		}
	},
	[],
	{ revalidate: 3600, tags: [UNSTABLE_CACHE_TAG] }
);
