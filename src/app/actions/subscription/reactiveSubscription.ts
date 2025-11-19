'use server';

import readCustomerId from './readCustomerIdAndSubscriptionId';
import verifySession from '@/helpers/dal';

export default async function reactiveSubscription(): Promise<{ data: string } | { error: string }> {
	let session = await verifySession();
	if (!session) {
		return { error: 'Unauthorized' };
	}
	let userId = session.id;

	try {
		let { subscriptionId } = await readCustomerId(userId);
		// TODO change to api.paddle.com when go live
		let reactiveSubscriptionUrl = `https://sandbox-api.paddle.com/subscriptions/${subscriptionId}`;

		let response = await fetch(reactiveSubscriptionUrl, {
			method: 'PATCH',
			headers: {
				Authorization: `Bearer ${process.env.PADDLE_API_KEY!}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				scheduled_change: null,
			}),
		});

		if (!response.ok) {
			throw new Error(`Failed to cancel subscription: ${response.statusText}`);
		}

		return { data: 'Successfully reactivated subscription.' };
	} catch (error) {
		console.error('Failed to cancel subscription', error);
		return { error: 'Failed to reactivate subscription, please try again later.' };
	}
}
