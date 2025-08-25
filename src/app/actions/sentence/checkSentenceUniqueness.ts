'use server';

import { SentenceSchema } from '@/lib';
import { handleZodError } from '@/utils';
import prisma from '@/lib/prisma';

export default async function checkSentenceUniqueness(data: unknown): Promise<{ error: string } | { data: boolean }> {
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
}
