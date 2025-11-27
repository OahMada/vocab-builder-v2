'use server';

import { ApiError } from '@paddle/paddle-node-sdk';

import readCustomerId from '../user/readCustomerIdAndSubscriptionId';

import { UserInfoInputSchema } from '@/lib';
import verifySession from '@/helpers/dal';
import { handleZodError } from '@/utils';
import { getPaddleInstance, handlePaddleSDKError } from '@/lib/paddle';

export default async function updatePaddleCustomerInfo(data: unknown): Promise<{ data: string } | { error: string }> {
	let session = await verifySession();
	if (!session) {
		return { error: 'Unauthorized.' };
	}
	let userId = session.id;

	let result = UserInfoInputSchema.safeParse(data);
	if (!result.success) {
		let error = handleZodError(result.error, 'prettify');
		return { error: error };
	}

	try {
		let { paddleCustomerId } = await readCustomerId(userId);
		if (!paddleCustomerId) {
			return {
				error: "User has't subscribed yet",
			};
		}

		let paddle = getPaddleInstance();
		await paddle.customers.update(paddleCustomerId, result.data);

		return { data: 'Paddle customer info updated successfully.' };
	} catch (error) {
		if (error instanceof ApiError) {
			handlePaddleSDKError(error);
			if (error.code === 'customer_already_exists') {
				return { error: 'A Paddle customer with the same email address already exists.' };
			}
		} else {
			console.error('Failed to update Paddle customer info', error);
		}

		return { error: 'Failed to update Paddle customer info.' };
	}
}
