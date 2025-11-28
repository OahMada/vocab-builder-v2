// trial or subscription

'use server';

import prisma from '@/lib/prisma';

export default async function checkSubscriptionStatus(userId: string, includeTrial: boolean = true): Promise<boolean> {
	let user = await prisma.user.findUnique({
		where: {
			id: userId,
		},
		select: {
			activeSubscriptionId: true,
			createdAt: true,
		},
	});

	if (!user) {
		throw new Error(`Could not find the user by id: ${userId}`);
	}

	if (includeTrial) {
		let trialExpireDate = new Date(user.createdAt.getTime() + 3 * 24 * 60 * 60 * 1000);

		if (trialExpireDate > new Date() || user.activeSubscriptionId) {
			return true;
		}
	} else {
		if (user.activeSubscriptionId) {
			return true;
		}
	}

	return false;
}
