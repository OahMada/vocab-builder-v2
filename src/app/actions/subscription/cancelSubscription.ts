'use server';

import { ApiError } from '@paddle/paddle-node-sdk';

import readCustomerId from '../user/readCustomerIdAndSubscriptionId';

import { getPaddleInstance, handlePaddleSDKError } from '@/lib/paddle';
import verifySession from '@/helpers/dal';

export default async function cancelSubscription(): Promise<{ data: string } | { error: string }> {
	let session = await verifySession();
	if (!session) {
		return { error: 'Unauthorized.' };
	}
	let userId = session.id;

	try {
		let { subscriptionId } = await readCustomerId(userId);
		let paddle = getPaddleInstance();

		if (!subscriptionId) {
			throw new Error('The user has no subscription records.');
		}

		await paddle.subscriptions.cancel(subscriptionId, {
			effectiveFrom: 'next_billing_period',
		});

		return { data: 'Subscription canceled successfully.' };
	} catch (error) {
		if (error instanceof ApiError) {
			handlePaddleSDKError(error);
		} else {
			console.error('Failed to cancel subscription', error);
		}
		return { error: 'Failed to cancel subscription, please try again later.' };
	}
}
