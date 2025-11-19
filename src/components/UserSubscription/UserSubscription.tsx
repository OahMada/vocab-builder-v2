import * as React from 'react';

import getSubscription from '@/app/actions/subscription/getSubscription';
import readUserTrialStatus from '@/app/actions/subscription/readUserTrialStatus';

import { SubscriptionDetail } from '@/types';

import ManageSubscription from '@/components/ManageSubscription';
import SubscriptionDetails from '@/components/SubscriptionDetails';
import SubscriptionSection from '@/components/SubscriptionSection';
import ViewPaymentDetails from '@/components/ViewPaymentDetails';
import TrialView from '@/components/TrialView';

// TODO error boundary around this component to handle thrown error

async function UserSubscription() {
	// read subscription data
	let subscriptionDetail: SubscriptionDetail | undefined = undefined;
	let getSubscriptionResult = await getSubscription();
	if ('error' in getSubscriptionResult) {
		throw new Error(getSubscriptionResult.error);
	} else {
		subscriptionDetail = getSubscriptionResult.data;
	}

	if (!subscriptionDetail) {
		let userTrialStatusResult = await readUserTrialStatus();
		if ('error' in userTrialStatusResult) {
			throw new Error(userTrialStatusResult.error);
		}

		let trialStatus = userTrialStatusResult.data;

		return (
			<SubscriptionSection title='Subscription Details'>
				<TrialView trialStatus={trialStatus} />
			</SubscriptionSection>
		);
	}

	return (
		<>
			<SubscriptionSection title='Subscription Details' description='Tax may apply, depending on your country of residence.'>
				<SubscriptionDetails subscriptionDetail={subscriptionDetail} />
			</SubscriptionSection>
			<SubscriptionSection
				title='Customer Portal'
				description='You can visit the Paddle Customer Portal to update payment methods, download invoices, view payment history, et cetera.'
			>
				<ViewPaymentDetails />
			</SubscriptionSection>
			<SubscriptionSection title='Manage Subscription'>
				{/* TODO what about when subscription is expired */}
				<ManageSubscription
					subscriptionCanceled={subscriptionDetail.scheduledChange?.action === 'cancel'}
					subscriptionActive={subscriptionDetail.status === 'active'}
				/>
			</SubscriptionSection>
		</>
	);
}

export default UserSubscription;
