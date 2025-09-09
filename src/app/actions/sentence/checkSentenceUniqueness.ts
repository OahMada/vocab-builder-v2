'use server';

import { unstable_cache } from 'next/cache';
import prisma from '@/lib/prisma';
import { SentenceSchema } from '@/lib';
import { handleZodError } from '@/utils';
import { UNSTABLE_CACHE_TAG } from '@/constants';

var checkSentenceUniqueness = unstable_cache(
	async function (data: unknown): Promise<{ error: string } | { data: boolean }> {
		let sentenceResult = SentenceSchema.safeParse({ sentence: data });
		if (!sentenceResult.success) {
			let errors = handleZodError(sentenceResult.error);
			return { error: errors.fieldErrors.sentence![0] as string };
		}

		let sentenceExisted: boolean;

		try {
			// throw new Error('');
			let uniqueSentence = await prisma.sentence.findUnique({
				where: {
					sentence: sentenceResult.data.sentence,
				},
			});

			if (uniqueSentence) {
				sentenceExisted = true;
			} else {
				sentenceExisted = false;
			}
		} catch (error) {
			console.error('Failed to check for sentence uniqueness.', error);
			return {
				error: 'Failed to check for sentence uniqueness.',
			};
		}

		return { data: sentenceExisted };
	},
	[],
	{ revalidate: 3600, tags: [UNSTABLE_CACHE_TAG] }
);

export default checkSentenceUniqueness;
