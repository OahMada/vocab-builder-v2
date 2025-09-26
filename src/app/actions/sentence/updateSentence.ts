'use server';

import { Prisma } from '@prisma/client';
import { revalidateTag } from 'next/cache';

import verifySession from '@/lib/dal';
import prisma from '@/lib/prisma';
import { SentenceUpdateInputSchema, SentenceWithPieces } from '@/lib';
import { handleZodError } from '@/utils';
import { sentenceReadSelect } from '@/lib';
import { UNSTABLE_CACHE_TAG } from '@/constants';

export default async function updateSentence(data: unknown): Promise<{ error: string } | { data: SentenceWithPieces }> {
	let session = await verifySession();
	if (!session) {
		return { error: 'Unauthorized' };
	}

	let userId = session.id;

	let result = SentenceUpdateInputSchema.safeParse(data);
	if (!result.success) {
		let error = handleZodError(result.error, 'prettify');
		return { error: error };
	}

	let { id, note, translation, pieces } = result.data;

	// prepare for saving to database
	let piecesUpdateInput = pieces.filter(
		(item): item is { id: string; word: string; index: number; IPA: string } => typeof item !== 'string' && Boolean(item.IPA)
	);

	let sentenceUpdateInput: Prisma.SentenceUpdateInput = {
		note: note ?? null,
		pieces: {
			deleteMany: {}, // remove all existing pieces
			create: piecesUpdateInput,
		},
		translation,
	};

	try {
		let updatedSentence = await prisma.sentence.update({
			where: {
				id,
				userId,
			},
			data: sentenceUpdateInput,
			select: sentenceReadSelect,
		});

		revalidateTag(UNSTABLE_CACHE_TAG.SENTENCES);
		return { data: updatedSentence };
	} catch (error) {
		console.error('sentence update failed', error);
		return { error: 'Failed to update sentence' };
	}
}
