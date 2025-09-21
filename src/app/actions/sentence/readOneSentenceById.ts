'use server';

import { unstable_cache } from 'next/cache';
import prisma from '@/lib/prisma';
import { ReadOneSentenceInputSchema, sentenceReadSelect, SentenceWithPieces } from '@/lib';
import { handleZodError } from '@/utils';
import { UNSTABLE_CACHE_TAG } from '@/constants';

var readOneSentenceById = unstable_cache(
	async function (data: unknown): Promise<{ error: string } | { data: null | SentenceWithPieces }> {
		let result = ReadOneSentenceInputSchema.safeParse(data);
		if (!result.success) {
			let error = handleZodError(result.error, 'prettify');
			return { error };
		}

		let { sentenceId, userId } = result.data;

		try {
			// throw new Error('');
			let sentenceData = await prisma.sentence.findUnique({
				where: {
					id: sentenceId,
					userId,
				},
				select: sentenceReadSelect,
			});
			return { data: sentenceData };
		} catch (error) {
			console.error('error reading sentence data', error);
			return {
				error: 'Failed to read specified sentence data',
			};
		}
	},
	[],
	{ revalidate: 3600, tags: [UNSTABLE_CACHE_TAG] }
);

export default readOneSentenceById;
