'use server';

import prisma from '@/lib/prisma';
import verifySession from '@/helpers/dal';
import { TrialStatus } from '@/types';

export default async function readUserTrialStatus(): Promise<
	| {
			data: TrialStatus;
	  }
	| { error: string }
> {
	let session = await verifySession();
	if (!session) {
		return { error: 'Unauthorized' };
	}
	let userId = session.id;

	try {
		let user = await prisma.user.findUnique({
			where: {
				id: userId,
			},
			select: {
				createdAt: true,
			},
		});

		if (!user) {
			throw new Error(`Could not find user with id: ${userId}}`);
		}
		let trialExpireDate = new Date(user.createdAt.getTime() + 3 * 24 * 60 * 60 * 1000);
		return {
			data: {
				status: trialExpireDate.getTime() >= Date.now() ? 'active' : 'expired',
				expireDate: trialExpireDate.toISOString(),
			},
		};
	} catch (error) {
		console.error('Failed to read user trial status', error);
		return {
			error: 'Failed to read user trial status.',
		};
	}
}
