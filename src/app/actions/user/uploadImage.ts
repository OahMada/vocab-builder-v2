'use server';

import { createId } from '@paralleldrive/cuid2';
import sharp from 'sharp';
import { BlockBlobClient } from '@azure/storage-blob';

import updateUserImage from './updateUserImage';

import { USER_UPDATE_ACTION } from '@/constants';
import { ImageFileSchema } from '@/lib';
import verifySession from '@/lib/dal';
import getBlockBlobClient from '@/lib/getBlockBlobClient';
import { handleZodError } from '@/utils';

async function saveToBlobStorage(blockBlobClient: BlockBlobClient, imageBuffer: Buffer, userId: string) {
	await blockBlobClient.uploadData(imageBuffer, {
		blobHTTPHeaders: { blobContentType: 'image/jpeg' },
		metadata: { userId },
	});
}

async function updateImage(image: string) {
	return await updateUserImage({ image, action: USER_UPDATE_ACTION.IMAGE });
}

export default async function uploadImage(formData: FormData): Promise<{ error: string } | { data: string }> {
	let session = await verifySession();
	if (!session) {
		return { error: 'Unauthorized' };
	}
	let userId = session.id;
	let file = formData.get('file') as File;

	if (!file) {
		return { error: 'No file uploaded' };
	}

	let result = ImageFileSchema.safeParse(file);
	if (!result.success) {
		let error = handleZodError(result.error, 'prettify');
		return { error };
	}

	let arrayBuffer = await result.data.arrayBuffer();
	let buffer = Buffer.from(arrayBuffer);

	let compressedBuffer = await sharp(buffer)
		.resize({ width: 512, height: 512, fit: 'cover' }) // optional: square crop
		.jpeg({ quality: 80 }) // compress to JPEG with 80% quality
		.toBuffer();

	let imageFileName = createId() + '.jpeg';
	let [blockBlobClient, containerClient] = getBlockBlobClient(imageFileName, 'image');
	let imageUrl = blockBlobClient.url;

	let [uploadResult, updateUserResult] = await Promise.allSettled([
		saveToBlobStorage(blockBlobClient, compressedBuffer, userId),
		updateImage(imageUrl),
	]);
	if (updateUserResult.status === 'rejected' || uploadResult.status === 'rejected') {
		if (uploadResult.status === 'rejected' && updateUserResult.status === 'fulfilled') {
			console.error('Azure Blob upload error:', uploadResult.reason);
			try {
				await updateUserImage({ action: USER_UPDATE_ACTION.IMAGE, image: null });
			} catch (error) {
				console.error('Failed to set user image url back null after uploading image file failed', error);
			}
		}
		if (uploadResult.status === 'fulfilled' && updateUserResult.status === 'rejected') {
			console.error('Update user image url failed:', updateUserResult.reason);

			try {
				await blockBlobClient.deleteIfExists({ deleteSnapshots: 'include' });
			} catch (cleanupError) {
				console.error('Cleanup failed after DB error:', cleanupError);
			}
		}
		return { error: 'Failed to upload image' };
	}

	// delete old ones
	let blobsToDelete: string[] = [];
	for await (let blob of containerClient.listBlobsFlat({ includeMetadata: true })) {
		if (blob.metadata?.userId === userId && blob.name !== imageFileName) {
			blobsToDelete.push(blob.name);
		}
	}

	try {
		await Promise.all(blobsToDelete.map((name) => containerClient.getBlockBlobClient(name).deleteIfExists()));
	} catch (error) {
		console.error('failed to delete all old account images', error);
	}

	return { data: updateUserResult.value.image as string };
}
