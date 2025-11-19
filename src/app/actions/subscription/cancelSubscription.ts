'use server';

import readCustomerId from './readCustomerIdAndSubscriptionId';
import verifySession from '@/helpers/dal';

export default async function cancelSubscription(): Promise<{ data: string } | { error: string }> {
	let session = await verifySession();
	if (!session) {
		return { error: 'Unauthorized' };
	}
	let userId = session.id;

	try {
		let { subscriptionId } = await readCustomerId(userId);
		// TODO change to api.paddle.com when go live
		let cancelSubscriptionUrl = `https://sandbox-api.paddle.com/subscriptions/${subscriptionId}/cancel`;

		let response = await fetch(cancelSubscriptionUrl, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${process.env.PADDLE_API_KEY!}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				effective_from: 'next_billing_period',
			}),
		});

		if (!response.ok) {
			throw new Error(`Failed to cancel subscription: ${response.statusText}`);
		}

		return { data: 'Subscription canceled successfully.' };
	} catch (error) {
		console.error('Failed to cancel subscription', error);
		return { error: 'Failed to cancel subscription, please try again later.' };
	}
}
