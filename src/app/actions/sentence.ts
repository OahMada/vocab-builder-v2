'use server';

import { Prisma } from '@prisma/client';

import cuid from 'cuid';
import { BlobServiceClient, BlockBlobClient } from '@azure/storage-blob';
import { DefaultAzureCredential } from '@azure/identity';
import { SentenceDataSchema } from '@/lib';
import { handleZodError } from '@/utils';
import prisma from '@/lib/prisma';

var sentenceSelect = {
	note: true,
	sentence: true,
	translation: true,
	audioUrl: true,
	pieces: {
		select: {
			IPA: true,
			piece: true,
		},
	},
} satisfies Prisma.SentenceSelect;

type SentencePayload = Prisma.SentenceGetPayload<{ select: typeof sentenceSelect }>;

function getAudioUrl(blobName: string): [BlockBlobClient, string] {
	let storageAccountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;

	if (!storageAccountName) throw new Error('Azure Storage accountName not found.');
	let blobServiceClient = new BlobServiceClient(`https://${storageAccountName}.blob.core.windows.net`, new DefaultAzureCredential());
	let containerName = process.env.AZURE_STORAGE_AUDIO_CONTAINER_NAME;
	if (!containerName) throw new Error('Azure Storage containerName not found.');
	let containerClient = blobServiceClient.getContainerClient(containerName);
	let blockBlobClient: BlockBlobClient = containerClient.getBlockBlobClient(blobName);
	return [blockBlobClient, blockBlobClient.url];
}

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
		select: sentenceSelect,
	});
	return createdSentence;
}

export async function saveSentenceData(data: unknown): Promise<{ error: string } | { data: SentencePayload }> {
	let sentenceId = cuid();
	let result = SentenceDataSchema.safeParse(data);
	if (!result.success) {
		let errors = handleZodError(result.error, 'prettify');
		return { error: errors };
	}

	// TODO put userId in the blob name for later batch delete userId/cuid.mp3
	let { audioBlob, note, words, ...rest } = result.data;

	// prepare for saving to blob storage
	let blobName = sentenceId + '.mp3';
	let [blockBlobClient, audioUrl] = getAudioUrl(blobName);

	// prepare for saving to database
	let wordsCreate = words
		.filter((item) => typeof item !== 'string')
		.map((item) => {
			return { ...item, IPA: item.IPA ?? null };
		});
	let sentenceCreate: Prisma.SentenceCreateInput = {
		...rest,
		id: sentenceId,
		audioUrl,
		note: note ?? null,
		pieces: {
			create: wordsCreate,
		},
	};

	// return { error: 'test error' };

	// handle saving logics
	let [blobResult, dbResult] = await Promise.allSettled([saveToBlobStorage(blockBlobClient, audioBlob), createDatabaseEntry(sentenceCreate)]);
	if (blobResult.status === 'rejected' || dbResult.status === 'rejected') {
		if (blobResult.status === 'rejected' && dbResult.status === 'fulfilled') {
			console.error('Azure Blob upload error:', blobResult.reason);
			// clean up
			try {
				await prisma.$transaction([
					prisma.piece.deleteMany({ where: { sentenceId: sentenceId } }),
					prisma.sentence.delete({ where: { id: sentenceId } }),
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
				await blockBlobClient.deleteIfExists();
			} catch (cleanupError) {
				console.error('Cleanup failed after DB error:', cleanupError);
			}
		}
		return { error: 'Failed to save sentence.' };
	}
	return { data: dbResult.value };
}
