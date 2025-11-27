'use server';

import { SubscriptionScheduledChangeNotification } from '@paddle/paddle-node-sdk';

import { subscriptionSelect } from '@/lib';
import prisma from '@/lib/prisma';
import { ScheduledChange, SubscriptionDetail } from '@/types';
import verifySession from '@/helpers/dal';

export default async function getSubscriptionDetails(): Promise<
	| {
			data: SubscriptionDetail | undefined;
	  }
	| { error: string }
> {
	let session = await verifySession();
	if (!session) {
		return { error: 'Unauthorized.' };
	}
	let userId = session.id;

	try {
		let user = await prisma.user.findUnique({
			where: {
				id: userId,
			},
			select: {
				activeSubscriptionId: true,
				previousSubscriptionId: true,
			},
		});

		if (!user) {
			throw new Error(`Could not find user by ID: ${userId}}`);
		}

		if (!user.activeSubscriptionId && !user.previousSubscriptionId) {
			return { data: undefined };
		}

		let querySubscriptionId = (user.activeSubscriptionId || user.previousSubscriptionId) as string;

		let subscriptionDetail = await prisma.subscription.findUnique({
			where: {
				subscriptionId: querySubscriptionId,
			},
			select: subscriptionSelect,
		});

		if (!subscriptionDetail) {
			throw new Error(`Could not find subscription by ID: ${user.activeSubscriptionId}}`);
		}

		let nextBillingAtString: string | undefined = undefined;
		let scheduledChangeDetail: ScheduledChange | undefined = undefined;
		let { nextBillingAt, scheduledChange, occurredAt } = subscriptionDetail;
		let occurredAtString: string = occurredAt.toISOString();

		nextBillingAtString = nextBillingAt ? nextBillingAt.toISOString() : undefined;

		if (scheduledChange) {
			let { effectiveAt, resumeAt, action } = scheduledChange as unknown as SubscriptionScheduledChangeNotification;
			scheduledChangeDetail = { action, effectiveAt: effectiveAt, resumeAt: resumeAt || undefined };
		}
		return {
			data: {
				...subscriptionDetail,
				nextBillingAt: nextBillingAtString,
				scheduledChange: scheduledChange ? scheduledChangeDetail : undefined,
				occurredAt: occurredAtString,
			},
		};
	} catch (error) {
		console.error('failed to read the subscription detail', error);
		return { error: 'Failed to read the subscription detail.' };
	}
}
