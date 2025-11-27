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
		},
	});

	if (!user) {
		throw new Error(`Could not find the user by id: ${userId}`);
	}

	let { paddleCustomerId, activeSubscriptionId: subscriptionId } = user;

	if (!subscriptionId) {
		throw new Error('The user has no subscription records.');
	}
	return { paddleCustomerId, subscriptionId };
}
