'use server';

import prisma from '@/lib/prisma';

export default async function readCustomerIdAndSubscriptionId(userId: string) {
	let user = await prisma.user.findUnique({
		where: {
			id: userId,
		},
		select: {
			paddleCustomerId: true,
			activeSubscriptionId: true,
			previousSubscriptionId: true,
		},
	});

	if (!user) {
		throw new Error(`Could not find the user by id: ${userId}`);
	}

	let { paddleCustomerId, activeSubscriptionId, previousSubscriptionId } = user;
	return { paddleCustomerId, subscriptionId: activeSubscriptionId || previousSubscriptionId };
}
