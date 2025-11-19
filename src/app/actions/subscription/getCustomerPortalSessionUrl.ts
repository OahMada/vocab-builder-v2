'use server';

import readCustomerId from './readCustomerIdAndSubscriptionId';
import verifySession from '@/helpers/dal';

export default async function getCustomerPortalSessionUrl(): Promise<{ data: string } | { error: string }> {
	let session = await verifySession();
	if (!session) {
		return { error: 'Unauthorized' };
	}
	let userId = session.id;

	try {
		let { paddleCustomerId: customerId, subscriptionId } = await readCustomerId(userId);
		// TODO change to api.paddle.com when go live
		let portalSessionUrl = `https://sandbox-api.paddle.com/customers/${customerId}/portal-sessions`;

		let response = await fetch(portalSessionUrl, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${process.env.PADDLE_API_KEY!}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ subscription_ids: [subscriptionId] }),
		});

		if (!response.ok) {
			throw new Error(`Failed to generate Paddle Customer Portal links: ${response.statusText}`);
		}
		let { data } = await response.json();
		let url = data.urls.general.overview as string;
		return { data: url };
	} catch (error) {
		console.error('Failed to generate Paddle Customer Portal links.', error);
		return { error: 'Failed to generate Paddle Customer Portal links.' };
	}
}
