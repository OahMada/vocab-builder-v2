'use server';

import prisma from '@/lib/prisma';
import verifySession from '@/helpers/dal';
import { handleZodError } from '@/utils';
import { UpdateUserImageSchema, userSelect } from '@/lib';
import getBlockBlobClient from '@/lib/getBlockBlobClient';
import getBlobNameFromUrl from '@/helpers/getBlobNamaFromUrl';

export default async function updateUserImage(data: unknown): Promise<{ error: string } | { data: string }> {
	let session = await verifySession();
	if (!session) {
		return { error: 'Unauthorized.' };
	}
	let userId = session.id;

	let result = UpdateUserImageSchema.safeParse(data);
	if (!result.success) {
		let error = handleZodError(result.error, 'prettify');
		return { error };
	}

	let { image } = result.data;
	let { containerClient } = getBlockBlobClient('image');
	let imageFileName = getBlobNameFromUrl(image);
	try {
		let updatedUser = await prisma.user.update({
			where: { id: userId },
			data: {
				image,
			},
			select: userSelect,
		});

		// delete old ones
		let blobsToDelete: string[] = [];
		for await (let blob of containerClient.listBlobsFlat({ includeMetadata: true })) {
			if (blob.metadata?.userid === userId && blob.name !== imageFileName) {
				blobsToDelete.push(blob.name);
			}
		}

		try {
			await Promise.all(blobsToDelete.map((name) => containerClient.getBlockBlobClient(name).deleteIfExists()));
		} catch (error) {
			console.error('failed to delete all old account images', error);
		}

		return { data: updatedUser.image as string };
	} catch (error) {
		console.error('user update failed', error);
		// clean up
		try {
			await containerClient.getBlockBlobClient(imageFileName).deleteIfExists();
		} catch (error) {
			console.error('failed to delete all old account images', error);
		}
		return { error: 'Failed to update user' };
	}
}
