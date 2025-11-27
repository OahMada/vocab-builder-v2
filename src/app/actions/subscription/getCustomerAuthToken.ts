'use server';

import { ApiError } from '@paddle/paddle-node-sdk';

import readCustomerId from '../user/readCustomerIdAndSubscriptionId';

import { getPaddleInstance, handlePaddleSDKError } from '@/lib/paddle';
import verifySession from '@/helpers/dal';

export default async function getCustomerAuthToken(): Promise<{ data: string | undefined } | { error: string }> {
	let session = await verifySession();
	if (!session) {
		return { error: 'Unauthorized.' };
	}
	let userId = session.id;

	try {
		let { paddleCustomerId: customerId } = await readCustomerId(userId);
		let paddle = getPaddleInstance();

		if (!customerId) {
			return { data: undefined };
		}

		let authToken = await paddle.customers.generateAuthToken(customerId);
		return { data: authToken.customerAuthToken };
	} catch (error) {
		if (error instanceof ApiError) {
			handlePaddleSDKError(error);
		} else {
			console.error('Failed to generate Paddle Customer auth token', error);
		}
		return { error: 'Failed to generate Paddle Customer auth token.' };
	}
}
