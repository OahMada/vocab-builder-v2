'use server';

import { ApiError } from '@paddle/paddle-node-sdk';

import readCustomerId from '../user/readCustomerIdAndSubscriptionId';

import { getPaddleInstance, handlePaddleSDKError } from '@/lib/paddle';
import verifySession from '@/helpers/dal';

export default async function reactiveSubscription(): Promise<{ data: string } | { error: string }> {
	let session = await verifySession();
	if (!session) {
		return { error: 'Unauthorized.' };
	}
	let userId = session.id;

	try {
		let { subscriptionId } = await readCustomerId(userId);
		if (!subscriptionId) {
			throw new Error('The user has no subscription records.');
		}
		let paddle = getPaddleInstance();

		await paddle.subscriptions.update(subscriptionId, { scheduledChange: null });

		return { data: 'Successfully reactivated subscription.' };
	} catch (error) {
		if (error instanceof ApiError) {
			handlePaddleSDKError(error);
		} else {
			console.error('Failed to reactivate subscription', error);
		}
		return { error: 'Failed to reactivate subscription, please try again later.' };
	}
}
