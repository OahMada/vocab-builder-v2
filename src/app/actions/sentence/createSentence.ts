'use server';

import { Prisma } from '@prisma/client';
import { revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';
import { createId } from '@paralleldrive/cuid2';
import { BlockBlobClient } from '@azure/storage-blob';

import { SentenceCreateInputSchema, sentenceReadSelect, SentenceWithPieces } from '@/lib';
import prisma from '@/lib/prisma';
import verifySession from '@/lib/dal';
import { getBlockBlobClient } from './helpers';
import { handleZodError } from '@/utils';
import { COOKIE_KEY, UNSTABLE_CACHE_TAG } from '@/constants';

async function saveToBlobStorage(blockBlobClient: BlockBlobClient, audioBlob: Blob) {
	// convert blob to buffer
	let arrayBuffer = await audioBlob.arrayBuffer();
	let buffer = Buffer.from(arrayBuffer);

	await blockBlobClient.uploadData(buffer, {
		blobHTTPHeaders: { blobContentType: 'audio/mpeg' },
	});
}

async function createDatabaseEntry(data: Prisma.SentenceCreateInput) {
	let createdSentence = await prisma.sentence.create({
		data,
		select: sentenceReadSelect,
	});
	return createdSentence;
}

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

	let { audioBlob, note, pieces, ...rest } = result.data;

	// prepare for saving to blob storage
	let blobName = sentenceId + '.mp3';
	let blockBlobClient = getBlockBlobClient(blobName);
	blockBlobClient.setMetadata({
		userId,
	});

	let audioUrl = blockBlobClient.url;

	// prepare for saving to database
	let piecesCreateInput = pieces
		.filter((item) => typeof item !== 'string')
		.map((item) => {
			return { ...item, IPA: item.IPA ?? null };
		});
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

	// return { error: 'test error' };

	// handle saving logics
	let [blobResult, dbResult] = await Promise.allSettled([saveToBlobStorage(blockBlobClient, audioBlob), createDatabaseEntry(sentenceCreateInput)]);
	if (blobResult.status === 'rejected' || dbResult.status === 'rejected') {
		if (blobResult.status === 'rejected' && dbResult.status === 'fulfilled') {
			console.error('Azure Blob upload error:', blobResult.reason);
			// clean up
			try {
				await prisma.$transaction([
					prisma.piece.deleteMany({ where: { sentenceId: sentenceId } }),
					prisma.sentence.delete({ where: { id: sentenceId, userId } }),
				]);
			} catch (error) {
				console.error('Cleanup failed after blob error:', error);
			}
		}
		if (blobResult.status === 'fulfilled' && dbResult.status === 'rejected') {
			// Log for debugging
			console.error('Error creating sentence:', dbResult.reason);
			// clean up
			try {
				await blockBlobClient.deleteIfExists({ deleteSnapshots: 'include' });
			} catch (cleanupError) {
				console.error('Cleanup failed after DB error:', cleanupError);
			}
		}
		return { error: 'Failed to save sentence' };
	}

	revalidateTag(UNSTABLE_CACHE_TAG);
	(await cookies()).delete(COOKIE_KEY);
	return { data: dbResult.value };
}
