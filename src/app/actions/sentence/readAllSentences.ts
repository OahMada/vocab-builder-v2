'use server';

import { unstable_cache } from 'next/cache';

import prisma from '@/lib/prisma';
import { sentenceReadSelect, SentenceWithPieces, ReadSentencesInputSchema, IdSchema } from '@/lib';
import { UNSTABLE_CACHE_TAG } from '@/constants';
import { handleZodError } from '@/utils';

export var readAllSentences = unstable_cache(
	async function (data?: unknown): Promise<{ error: string } | { data: SentenceWithPieces[]; nextCursor: string | null }> {
		let result = ReadSentencesInputSchema.safeParse(data);
		if (!result.success) {
			let error = handleZodError(result.error, 'prettify');
			return { error: error };
		}

		let { cursor, limit, userId } = result.data;
		try {
			let sentences = await prisma.sentence.findMany({
				where: { userId },
				select: sentenceReadSelect,
				orderBy: { updatedAt: 'desc' },
				...(limit && { take: limit + 1 }),
				...(cursor && { cursor: { id: cursor } }),
			});
			let nextCursor: string | null = null;
			if (limit && sentences.length > limit) {
				let nextItem = sentences.pop();
				nextCursor = nextItem!.id;
			}
			// return { error: 'Failed to fetch sentences' };
			return { data: sentences, nextCursor };
		} catch (error) {
			console.error('fetch all sentences failed', error);
			return { error: 'Failed to fetch the sentences' };
		}
	},
	[],
	{ revalidate: 3600, tags: [UNSTABLE_CACHE_TAG.SENTENCES] }
);

export var countSentences = unstable_cache(
	async function (data: unknown): Promise<{ error: string } | { data: number }> {
		let result = IdSchema.safeParse(data);
		if (!result.success) {
			let errors = handleZodError(result.error);
			return { error: errors.formErrors[0] };
		}

		try {
			let count = await prisma.sentence.count({ where: { userId: result.data } });
			// throw new Error('error');
			return { data: count };
		} catch (error) {
			console.error('count sentences amount failed', error);
			return { error: 'Failed to count the amount of sentences' };
		}
	},
	[],
	{ revalidate: 3600, tags: [UNSTABLE_CACHE_TAG.SENTENCES] }
);
