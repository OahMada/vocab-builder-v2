'use server';

import pLimit from 'p-limit';

import { DeleteUserInputSchema } from '@/lib';
import verifySession from '@/lib/dal';
import { handleZodError } from '@/utils';
import prisma from '@/lib/prisma';
import getBlockBlobClient from '@/lib/getBlockBlobClient';

export default async function deleteUser(data: unknown): Promise<{ error: string } | undefined> {
	let session = await verifySession();
	if (!session) {
		return { error: 'Unauthorized' };
	}
	let userId = session.id;
	let userEmail = session.email as string;

	let result = DeleteUserInputSchema.safeParse(data);

	if (!result.success) {
		let error = handleZodError(result.error);
		return { error: error.fieldErrors.email![0] };
	}

	if (userEmail !== result.data.email) {
		return { error: 'The entered email does not match the account email' };
	}

	try {
		await prisma.$transaction([
			prisma.piece.deleteMany({
				where: {
					sentence: {
						userId,
					},
				},
			}),
			prisma.sentence.deleteMany({
				where: { userId },
			}),

			prisma.user.delete({
				where: {
					id: userId,
				},
			}),

			prisma.account.deleteMany({
				where: {
					userId,
				},
			}),
		]);
	} catch (error) {
		console.error('delete user and user data failed: ', error);
		return { error: 'Failed to delete user' };
	}

	try {
		let { containerClient: imageContainerClient } = getBlockBlobClient('image');
		let { containerClient: audioContainerClient } = getBlockBlobClient('audio');

		let audioBlobsToDelete: string[] = [];
		for await (let blob of audioContainerClient.listBlobsFlat({ includeMetadata: true })) {
			if (blob.metadata?.userid === userId) {
				audioBlobsToDelete.push(blob.name);
			}
		}

		let imageBlobsToDelete: string[] = [];
		for await (let blob of imageContainerClient.listBlobsFlat({ includeMetadata: true })) {
			if (blob.metadata?.userid === userId) {
				imageBlobsToDelete.push(blob.name);
			}
		}

		let limit = pLimit(10);
		// delete image
		await limit.map(imageBlobsToDelete, (name) => imageContainerClient.getBlockBlobClient(name).deleteIfExists());
		// Delete audio
		await limit.map(audioBlobsToDelete, (name) => audioContainerClient.getBlockBlobClient(name).deleteIfExists());
	} catch (error) {
		console.error(`delete user blob data failed. Userid: ${userId}.`, error);
	}
}
