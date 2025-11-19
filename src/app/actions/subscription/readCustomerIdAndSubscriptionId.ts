'use server';

import prisma from '@/lib/prisma';

export default async function readCustomerIdAndSubscriptionId(userId: string) {
	let user = await prisma.user.findUnique({
		where: {
			id: userId,
		},
		include: {
			subscription: true,
		},
	});

	if (!user) {
		throw new Error('Could not find the user.');
	}
	let { paddleCustomerId, subscription } = user;

	if (!subscription) {
		throw new Error('The user has no subscription records.');
	}
	let { subscriptionId } = subscription;
	return { paddleCustomerId, subscriptionId };
}
