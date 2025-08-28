'use server';

import prisma from '@/lib/prisma';
import { IdSchema, sentenceReadSelect, SentenceWithPieces } from '@/lib';
import { handleZodError } from '@/utils';

export default async function readOneSentenceById(data: unknown): Promise<{ error: string } | { data: null | SentenceWithPieces }> {
	let idResult = IdSchema.safeParse(data);
	if (!idResult.success) {
		let errors = handleZodError(idResult.error);
		return { error: errors.formErrors[0] as string };
	}

	try {
		// throw new Error('');
		let sentenceData = await prisma.sentence.findUnique({
			where: {
				id: idResult.data,
			},
			select: sentenceReadSelect,
		});
		return { data: sentenceData };
	} catch (error) {
		console.error('error reading sentence data', error);
		return {
			error: 'Failed to read specified sentence data.',
		};
	}
}
