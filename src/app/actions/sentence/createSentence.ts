'use server';

import { Prisma } from '@prisma/client';
import { revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';
import { createId } from '@paralleldrive/cuid2';

import { SentenceCreateInputSchema, sentenceReadSelect, SentenceWithPieces } from '@/lib';
import prisma from '@/lib/prisma';
import verifySession from '@/lib/dal';
import { handleZodError } from '@/utils';
import { COOKIE_KEY, UNSTABLE_CACHE_TAG } from '@/constants';
import getBlobNameFromUrl from '@/helpers/getBlobNamaFromUrl';
import getBlockBlobClient from '@/lib/getBlockBlobClient';

export default async function createSentence(data: unknown): Promise<{ error: string } | { data: SentenceWithPieces }> {
	let session = await verifySession();

	if (!session) {
		return { error: 'Unauthorized' };
	}

	let userId = session.id;

	let sentenceId = createId();
	let result = SentenceCreateInputSchema.safeParse(data);
	if (!result.success) {
		let error = handleZodError(result.error, 'prettify');
		return { error: error };
	}

	let { audioUrl, note, pieces, ...rest } = result.data;

	// prepare for saving to database
	let piecesCreateInput = pieces.filter(
		(item): item is { id: string; word: string; index: number; IPA: string } => typeof item !== 'string' && Boolean(item.IPA)
	);

	let sentenceCreateInput: Prisma.SentenceCreateInput = {
		...rest,
		id: sentenceId,
		audioUrl,
		note: note ?? null,
		pieces: {
			create: piecesCreateInput,
		},
		user: {
			connect: {
				id: userId,
			},
		},
	};

	try {
		let createdSentence = await prisma.sentence.create({
			data: sentenceCreateInput,
			select: sentenceReadSelect,
		});

		revalidateTag(UNSTABLE_CACHE_TAG.SENTENCES);
		(await cookies()).delete(COOKIE_KEY);
		return { data: createdSentence };
	} catch (error) {
		console.error('Error creating sentence:', error);

		let audioFileName = getBlobNameFromUrl(audioUrl);
		try {
			let { blockBlobClient } = getBlockBlobClient('audio', audioFileName);
			await blockBlobClient.deleteIfExists();
		} catch (error) {
			console.error('failed to delete the related audio file', error);
		}
		return { error: 'Failed to save sentence' };
	}
}
