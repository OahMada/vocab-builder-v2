'use server';

import { Prisma } from '@prisma/client';
import { SentenceUpdateDataSchema, SentenceWithPieces } from '@/lib';
import prisma from '@/lib/prisma';
import { handleZodError } from '@/utils';
import { sentenceReadSelect } from '@/lib';
import { revalidateTag } from 'next/cache';

export default async function updateSentence(data: unknown): Promise<{ error: string } | { data: SentenceWithPieces }> {
	let result = SentenceUpdateDataSchema.safeParse(data);
	if (!result.success) {
		let error = handleZodError(result.error, 'prettify');
		return { error: error };
	}

	let { id, note, translation, pieces } = result.data;

	// prepare for saving to database
	let piecesCreate = pieces
		.filter((item) => typeof item !== 'string')
		.map((item) => {
			return { ...item, IPA: item.IPA ?? null };
		});
	let sentenceUpdate: Prisma.SentenceUpdateInput = {
		note: note ?? null,
		pieces: {
			deleteMany: {}, // remove all existing pieces
			create: piecesCreate.map((p) => ({
				id: p.id,
				piece: p.piece,
				IPA: p.IPA,
			})),
		},
		translation,
	};

	try {
		let updatedSentence = await prisma.sentence.update({
			where: {
				id,
			},
			data: sentenceUpdate,
			select: sentenceReadSelect,
		});

		revalidateTag('sentences');
		return { data: updatedSentence };
	} catch (error) {
		console.error('sentence update failed', error);
		return { error: 'Failed to update sentence.' };
	}
}
