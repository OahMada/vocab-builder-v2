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
	let piecesCreateInput = pieces
		.filter((item) => typeof item !== 'string')
		.map((item) => {
			return { ...item, IPA: item.IPA ?? null };
		});
	let sentenceUpdateInput: Prisma.SentenceUpdateInput = {
		note: note ?? null,
		pieces: {
			deleteMany: {}, // remove all existing pieces
			create: piecesCreateInput.map((p) => ({
				id: p.id,
				word: p.word,
				IPA: p.IPA,
			})),
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

		revalidateTag(UNSTABLE_CACHE_TAG);
		return { data: updatedSentence };
	} catch (error) {
		console.error('sentence update failed', error);
		return { error: 'Failed to update sentence' };
	}
}
