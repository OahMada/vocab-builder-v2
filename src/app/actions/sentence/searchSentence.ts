'use server';

import prisma from '@/lib/prisma';
import { SearchInputSchema } from '@/lib';
import { handleZodError } from '@/utils';
import { SENTENCE_FETCHING_LIMIT } from '@/constants';
import { Document } from 'mongodb';
import { SearchResults } from '@/types';

type SearchResultsWithPaginationToken = SearchResults & { paginationToken: string };

function buildSearchPipeline(search: string, nextCursor?: string) {
	let databaseIndexName = process.env.DATABASE_INDEX_NAME;
	if (!databaseIndexName) throw new Error('Database index name not found');
	let searchStage: Document = {
		$search: {
			index: 'sentences-index',
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

export default async function searchSentences(data: unknown): Promise<{ error: string } | { data: SearchResults[]; nextCursor: string | null }> {
	let result = SearchInputSchema.safeParse(data);
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

		return { data: sentences, nextCursor };
	} catch (error) {
		console.error('could not perform search action', error);
		return { error: 'Failed to search, please try again later.' };
	}
}
