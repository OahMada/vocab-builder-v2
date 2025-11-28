'use client';

import * as React from 'react';
import { SubscriptionStatus } from '@paddle/paddle-node-sdk';

import getCustomerPortalSessionUrl from '@/app/actions/subscription/getCustomerPortalSessionUrl';

import { CustomerPortalSessionUrlType, TOAST_ID } from '@/constants';

import { Button } from '@/components/Button';
import Icon from '@/components/Icon';
import { useGlobalToastContext } from '@/components/GlobalToastProvider';
import Loading from '@/components/Loading';

function VisitPaddleCustomerPortal({ subscriptionStatus }: { subscriptionStatus: SubscriptionStatus }) {
	let [loading, startTransition] = React.useTransition();
	let { addToToast } = useGlobalToastContext();

	function visitCustomerPortal() {
		startTransition(async () => {
			let result = await getCustomerPortalSessionUrl(CustomerPortalSessionUrlType.GENERAL);
			if ('error' in result) {
				addToToast({
					contentType: 'error',
					content: result.error,
					id: TOAST_ID.CUSTOMER_PORTAL,
				});
				return;
			}
			let customerPortalUrl = result.data;
			window.open(customerPortalUrl, '_blank', 'noopener,noreferrer');
		});
	}

	function updatePaymentMethod() {
		startTransition(async () => {
			let result = await getCustomerPortalSessionUrl(CustomerPortalSessionUrlType.PAYMENT_METHOD);
			if ('error' in result) {
				addToToast({
					contentType: 'error',
					content: result.error,
					id: TOAST_ID.CUSTOMER_PORTAL,
				});
				return;
			}
			let customerPortalUrl = result.data;
			window.open(customerPortalUrl, '_blank', 'noopener,noreferrer');
		});
	}

	return (
		<>
			{(subscriptionStatus === 'active' || subscriptionStatus === 'canceled') && (
				<Button variant='outline' onClick={visitCustomerPortal}>
					{loading ? <Loading description='generating paddle customer portal url' /> : <Icon id='external-link' />}
					&nbsp;Visit Customer Portal
				</Button>
			)}
			{subscriptionStatus === 'past_due' && (
				<Button variant='outline' onClick={updatePaymentMethod}>
					{loading ? <Loading description='generating paddle customer portal url' /> : <Icon id='external-link' />}
					&nbsp;Update Payment Method
				</Button>
			)}
		</>
	);
}

export default VisitPaddleCustomerPortal;
