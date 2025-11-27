'use server';

import verifySession from '@/helpers/dal';
import prisma from '@/lib/prisma';

async function checkAccountLinkStatus(): Promise<{ error: string } | { data: string | undefined }> {
	let session = await verifySession();
	if (!session) {
		return { error: 'Unauthorized.' };
	}
	let userId = session.id;

	try {
		let foundAccount = await prisma.account.findFirst({
			where: {
				provider: 'google',
				userId,
			},
			select: { id: true },
		});

		return { data: foundAccount?.id || undefined };
	} catch (error) {
		console.error('failed to check account link status: ', error);
		return { error: 'Failed to check for google account link status' };
	}
}

export default checkAccountLinkStatus;
