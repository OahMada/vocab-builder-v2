import { NextResponse, NextRequest } from 'next/server';
import { CustomData, EventName } from '@paddle/paddle-node-sdk';

import { getPaddleInstance } from '@/lib/paddle';
import prisma from '@/lib/prisma';

interface PaddleCustomData extends CustomData {
	userId: string;
}

export async function POST(request: NextRequest) {
	let signature = request.headers.get('paddle-signature');
	let rawRequestBody = await request.text();

	let privateKey = process.env.PADDLE_NOTIFICATION_WEBHOOK_SECRET!;

	try {
		if (!signature || !rawRequestBody) {
			return NextResponse.json({ error: 'Missing signature from header' }, { status: 400 });
		}

		let paddle = getPaddleInstance();
		let eventData = await paddle.webhooks.unmarshal(rawRequestBody, privateKey, signature);
		let eventName = eventData?.eventType ?? 'Unknown event';

		if (eventData) {
			if (eventData.eventType === EventName.SubscriptionCreated || eventData.eventType === EventName.SubscriptionUpdated) {
				let customData = eventData.data.customData as PaddleCustomData;
				let item = eventData.data.items?.[0];

				await prisma.subscription.upsert({
					where: {
						subscriptionId: eventData.data.id,
					},
					update: {
						subscriptionId: eventData.data.id,
						priceId: item.price?.id ?? '',
						productId: item.price?.productId ?? '',
						status: eventData.data.status,
						collectionMode: eventData.data.collectionMode,
						occurredAt: eventData.occurredAt,
						scheduledChange: eventData.data.scheduledChange ? JSON.parse(JSON.stringify(eventData.data.scheduledChange)) : null,
						nextBillingAt: eventData.data.nextBilledAt ? new Date(eventData.data.nextBilledAt) : null,
					},
					create: {
						userId: customData?.userId,
						subscriptionId: eventData.data.id,
						priceId: item.price?.id ?? '',
						productId: item.price?.productId ?? '',
						status: eventData.data.status,
						collectionMode: eventData.data.collectionMode,
						occurredAt: eventData.occurredAt,
						scheduledChange: eventData.data.scheduledChange ? JSON.parse(JSON.stringify(eventData.data.scheduledChange)) : null,
						nextBillingAt: eventData.data.nextBilledAt ? new Date(eventData.data.nextBilledAt) : null,
					},
				});
			} else if (eventData.eventType === EventName.CustomerCreated) {
				await prisma.user.update({
					where: {
						email: eventData.data.email,
					},
					data: {
						paddleCustomerId: eventData.data.id,
					},
				});
			}
		}

		return NextResponse.json({ status: 200, eventName });
	} catch (e) {
		console.error(e);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}
