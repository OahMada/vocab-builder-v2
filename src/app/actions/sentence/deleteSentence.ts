'use server';

import { revalidateTag } from 'next/cache';

import prisma from '@/lib/prisma';
import verifySession from '@/helpers/dal';
import { sentenceReadSelect, SentenceWithPieces, DeleteSentenceInputSchema } from '@/lib';
import { handleZodError } from '@/utils';
import { UNSTABLE_CACHE_TAG } from '@/constants';
import getBlockBlobClient from '@/lib/getBlockBlobClient';
import getBlobNameFromUrl from '@/helpers/getBlobNamaFromUrl';

async function deleteDatabaseEntry(sentenceId: string, userId: string) {
	let deletedSentence = await prisma.$transaction([
		prisma.piece.deleteMany({ where: { sentenceId } }),
		prisma.sentence.delete({ where: { id: sentenceId, userId: userId }, select: sentenceReadSelect }),
	]);

	return deletedSentence;
}

export default async function deleteSentence(data: unknown): Promise<{ error: string } | { data: SentenceWithPieces }> {
	let session = await verifySession();
	if (!session) {
		return { error: 'Unauthorized' };
	}

	let userId = session.id;
	let result = DeleteSentenceInputSchema.safeParse(data);
	if (!result.success) {
		let errors = handleZodError(result.error, 'prettify');
		return { error: errors };
	}

	let { audioUrl, sentenceId } = result.data;

	let blobName = getBlobNameFromUrl(audioUrl);
	let { blockBlobClient } = getBlockBlobClient('audio', blobName);

	let [dbResult, blobResult] = await Promise.allSettled([deleteDatabaseEntry(sentenceId, userId), blockBlobClient.deleteIfExists()]);

	if (dbResult.status === 'rejected' || blobResult.status === 'rejected') {
		if (dbResult.status === 'rejected' && blobResult.status === 'fulfilled') {
			console.error('Error deleting sentence:', dbResult.reason);

			// restore blob
			try {
				await blockBlobClient.undelete();
			} catch (error) {
				console.error('restore audio blob failed:', error);
			}
		} else if (dbResult.status === 'fulfilled' && blobResult.status === 'rejected') {
			console.error('Azure Blob deletion error:', blobResult.reason);

			// try delete blob again
			try {
				await blockBlobClient.deleteIfExists({ deleteSnapshots: 'include' });
			} catch (error) {
				console.error('Retrying blob deletion failed:', error);
			}
		}

		return { error: 'failed to delete sentence' };
	}

	revalidateTag(UNSTABLE_CACHE_TAG.SENTENCES);
	return { data: dbResult.value[1] };
}
