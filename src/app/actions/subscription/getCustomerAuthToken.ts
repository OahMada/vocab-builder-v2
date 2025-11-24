'use server';

import readCustomerId from './readCustomerIdAndSubscriptionId';
import verifySession from '@/helpers/dal';

// TODO what if a new customer is doing it? what data is returned?

export default async function getCustomerAuthToken(): Promise<{ data: string } | { error: string }> {
	let session = await verifySession();
	if (!session) {
		return { error: 'Unauthorized' };
	}
	let userId = session.id;

	try {
		let { paddleCustomerId: customerId } = await readCustomerId(userId);
		// TODO change to api.paddle.com when go live
		let authTokenUrl = `https://sandbox-api.paddle.com/customers/${customerId}/auth-token`;

		let response = await fetch(authTokenUrl, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${process.env.PADDLE_API_KEY!}`,
				'Content-Type': 'application/json',
			},
		});

		if (!response.ok) {
			let data = await response.json();
			let fieldErrors: string = '';
			if (data.error.errors) {
				fieldErrors = data.error.errors.map((err: { field: string; message: string }) => `${err.field} : ${err.message}.`).join(' ');
			}
			throw new Error(
				`${response.statusText}\nError code: ${data.error.code}\nError detail: ${data.error.detail}${
					fieldErrors ? `\nField Errors: ${fieldErrors}` : ''
				}`
			);
		}
		let { data } = await response.json();
		let authToken = data.customer_auth_token as string;
		return { data: authToken };
	} catch (error) {
		console.error('Failed to generate Paddle Customer auth token', error);
		return { error: 'Failed to generate Paddle Customer auth token.' };
	}
}
