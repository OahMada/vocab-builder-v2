'use server';

import verifySession from '@/helpers/dal';
import prisma from '@/lib/prisma';

export default async function unlinkGoogleAccount(): Promise<{ error: string } | { data: string }> {
	let session = await verifySession();
	if (!session) {
		return { error: 'Unauthorized.' };
	}
	let userId = session.id;

	try {
		await prisma.account.deleteMany({
			where: {
				provider: 'google',
				userId,
			},
		});
		return { data: 'Google account unlinked' };
	} catch (error) {
		console.error('failed to check account link status: ', error);
		return { error: 'Failed to check for google account link status' };
	}
}
