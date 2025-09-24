'use server';

import prisma from '@/lib/prisma';
import verifySession from '@/lib/dal';
import { handleZodError } from '@/utils';
import { UpdateUserImageSchema, User, userSelect } from '@/lib';

export default async function updateUserImage(data: unknown): Promise<User> {
	let session = await verifySession();
	if (!session) {
		throw new Error('Unauthorized');
	}
	let userId = session.id;

	let result = UpdateUserImageSchema.safeParse(data);
	if (!result.success) {
		let error = handleZodError(result.error, 'prettify');
		throw new Error(error);
	}

	try {
		let { image } = result.data;
		let updatedUser = await prisma.user.update({
			where: { id: userId },
			data: {
				image,
			},
			select: userSelect,
		});
		return updatedUser;
	} catch (error) {
		console.error('user update failed', error);
		// this is consumed by another server function
		throw new Error('Failed to update user');
	}
}
