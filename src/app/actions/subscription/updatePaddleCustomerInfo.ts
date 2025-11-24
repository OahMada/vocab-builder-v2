'use server';

import readCustomerId from './readCustomerIdAndSubscriptionId';

import { UserInfoInputSchema } from '@/lib';
import verifySession from '@/helpers/dal';
import { handleZodError } from '@/utils';

export default async function updatePaddleCustomerInfo(data: unknown): Promise<{ data: string } | { error: string }> {
	let session = await verifySession();
	if (!session) {
		return { error: 'Unauthorized' };
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

		// TODO update url when go live
		let updateCustomerInfoUrl = `https://sandbox-api.paddle.com/customers/${paddleCustomerId}`;
		let response = await fetch(updateCustomerInfoUrl, {
			method: 'PATCH',
			headers: {
				Authorization: `Bearer ${process.env.PADDLE_API_KEY!}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(result.data),
		});

		if (!response.ok) {
			let data = await response.json();
			let fieldErrors: string = '';
			if (data.error.errors) {
				fieldErrors = data.error.errors.map((err: { field: string; message: string }) => `${err.field} : ${err.message}.`).join(' ');
			}

			if (response.statusText === 'Conflict') {
				return { error: 'A Paddle customer with the same email address already exists.' };
			}
			throw new Error(
				`${response.statusText}\nError code: ${data.error.code}\nError detail: ${data.error.detail}${
					fieldErrors ? `\nField Errors: ${fieldErrors}` : ''
				}`
			);
		}

		return { data: 'Paddle customer info updated successfully.' };
	} catch (error) {
		console.error('Failed to update Paddle customer info', error);
		return { error: 'Failed to update Paddle customer info.' };
	}
}
