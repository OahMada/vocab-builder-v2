'use server';

import prisma from '@/lib/prisma';
import { revalidateTag } from 'next/cache';
import { IdSchema, sentenceReadSelect, SentenceWithPieces } from '@/lib';
import { handleZodError } from '@/utils';

export default async function deleteSentence(sentenceId: unknown): Promise<{ error: string } | { data: SentenceWithPieces }> {
	let idResult = IdSchema.safeParse(sentenceId);
	if (!idResult.success) {
		let errors = handleZodError(idResult.error);
		return { error: errors.formErrors[0] as string };
	}

	try {
		// throw new Error('');
		let deletedSentence = await prisma.$transaction([
			prisma.piece.deleteMany({ where: { sentenceId: idResult.data } }),
			prisma.sentence.delete({ where: { id: idResult.data }, select: sentenceReadSelect }),
		]);
		revalidateTag('sentences');
		revalidateTag('latest');
		return { data: deletedSentence[1] };
	} catch (error) {
		console.error('Error deleting sentence', error);
		return { error: 'Failed to delete the sentence.' };
	}
}
