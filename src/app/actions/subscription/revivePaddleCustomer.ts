'use server';

import { ApiError } from '@paddle/paddle-node-sdk';

import { EmailSchema } from '@/lib';
import { getPaddleInstance, handlePaddleSDKError } from '@/lib/paddle';
import prisma from '@/lib/prisma';
import { handleZodError } from '@/utils';

// TODO remove console logs

export default async function revivePaddleCustomer(data: unknown): Promise<{ data: string } | { error: string }> {
	let result = EmailSchema.safeParse(data);
	if (!result.success) {
		let error = handleZodError(result.error);
		return { error: error.formErrors[0] };
	}

	let email = result.data;

	try {
		let paddle = getPaddleInstance();
		let customerCollection = paddle.customers.list({ email: [email] });
		let customers = await customerCollection.next();

		let existingCustomerId: string | undefined = undefined;
		if (customers.length !== 0) {
			if (customers[0].status === 'active') {
				// the archive action might be failed when user deleted their account
				return { data: 'Paddle Customer is active' };
			}
			existingCustomerId = customers[0].id;
		}

		if (!existingCustomerId) {
			return { data: 'No existing customer found.' };
		}

		await paddle.customers.update(existingCustomerId, {
			status: 'active',
		});

		await prisma.user.update({
			where: {
				email,
			},
			data: {
				paddleCustomerId: existingCustomerId,
			},
		});

		return { data: 'Successfully revived Paddle customer.' };
	} catch (error) {
		if (error instanceof ApiError) {
			handlePaddleSDKError(error);
		} else {
			console.error('Failed to revive Paddle customer', error);
		}
		return { error: 'Failed to revive Paddle customer.' };
	}
}
