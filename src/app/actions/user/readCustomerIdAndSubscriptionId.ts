'use server';

import prisma from '@/lib/prisma';
import { IdSchema } from '@/lib';
import { handleZodError } from '@/utils';
import verifySession from '@/helpers/dal';

export default async function readCustomerIdAndSubscriptionId(data: unknown) {
	let session = await verifySession();
	if (!session) {
		throw new Error('Unauthorized.');
	}

	let result = IdSchema.safeParse(data);
	if (!result.success) {
		let errors = handleZodError(result.error);
		throw new Error(errors.formErrors[0]);
	}

	let user = await prisma.user.findUnique({
		where: {
			id: result.data,
		},
		select: {
			paddleCustomerId: true,
			activeSubscriptionId: true,
			previousSubscriptionId: true,
		},
	});

	if (!user) {
		throw new Error(`Could not find the user by id: ${result.data}`);
	}

	let { paddleCustomerId, activeSubscriptionId, previousSubscriptionId } = user;
	return { paddleCustomerId, subscriptionId: activeSubscriptionId || previousSubscriptionId };
}
