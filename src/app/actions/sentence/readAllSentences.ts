'use server';

import { sentenceReadSelect, SentenceWithPieces } from '@/lib';
import prisma from '@/lib/prisma';
import { SENTENCE_FETCHING_LIMIT } from '@/constants';

export default async function readAllSentences(
	cursor?: string,
	limit = SENTENCE_FETCHING_LIMIT
): Promise<{ error: string } | { data: SentenceWithPieces[]; nextCursor: string | null }> {
	try {
		let sentences = await prisma.sentence.findMany({
			select: sentenceReadSelect,
			orderBy: { createdAt: 'desc' },
			take: limit + 1,
			...(cursor && { cursor: { id: cursor } }),
		});

		let nextCursor: string | null = null;
		if (sentences.length > limit) {
			let nextItem = sentences.pop();
			nextCursor = nextItem!.id;
		}
		// return { error: 'Failed to fetch sentences' };
		return { data: sentences, nextCursor };
	} catch (error) {
		console.error('fetch all sentences failed', error);
		return { error: 'Failed to fetch the sentences.' };
	}
}
