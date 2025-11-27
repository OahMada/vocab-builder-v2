'use server';

import { ApiError } from '@paddle/paddle-node-sdk';

import readCustomerId from '../user/readCustomerIdAndSubscriptionId';
import verifySession from '@/helpers/dal';
import { getPaddleInstance, handlePaddleSDKError } from '@/lib/paddle';
import { GetCustomerPortalSessionUrlInputSchema } from '@/lib';
import { handleZodError } from '@/utils';

export default async function getCustomerPortalSessionUrl(data: unknown): Promise<{ data: string } | { error: string }> {
	let session = await verifySession();
	if (!session) {
		return { error: 'Unauthorized.' };
	}
	let userId = session.id;

	let parseResult = GetCustomerPortalSessionUrlInputSchema.safeParse(data);
	if (!parseResult.success) {
		let error = handleZodError(parseResult.error);
		return { error: error.formErrors[0] };
	}

	let type = parseResult.data;

	try {
		let { paddleCustomerId: customerId, subscriptionId } = await readCustomerId(userId);

		let paddle = getPaddleInstance();

		if (!customerId) {
			throw new Error('Failed to access Paddle customer ID.');
		}
		let { urls } = await paddle.customerPortalSessions.create(customerId, [subscriptionId]);

		if (type === 'general') {
			let url = urls.general.overview;
			return { data: url };
		} else if (type === 'payment_method') {
			let url = urls.subscriptions[0].updateSubscriptionPaymentMethod;
			return { data: url };
		} else {
			return { error: `Type ${type}} is not supported.` };
		}
	} catch (error) {
		if (error instanceof ApiError) {
			handlePaddleSDKError(error);
		} else {
			console.error('Failed to generate Paddle Customer Portal links.', error);
		}
		return { error: 'Failed to generate Paddle Customer Portal links.' };
	}
}
