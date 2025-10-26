'use server';

import { unstable_cache } from 'next/cache';

import prisma from '@/lib/prisma';
import { CheckSentenceInputSchema } from '@/lib';
import { handleZodError } from '@/utils';
import { UNSTABLE_CACHE_TAG } from '@/constants';

var checkSentenceUniqueness = unstable_cache(
	async function (data: unknown): Promise<{ error: string } | { data: boolean }> {
		let result = CheckSentenceInputSchema.safeParse(data);
		if (!result.success) {
			let error = handleZodError(result.error, 'prettify');
			return { error };
		}

		let { sentence, userId } = result.data;

		let sentenceExisted: boolean;

		try {
			let uniqueSentence = await prisma.sentence.findFirst({
				where: {
					sentence,
					userId,
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
	{ revalidate: 3600, tags: [UNSTABLE_CACHE_TAG.SENTENCES] }
);

export default checkSentenceUniqueness;
