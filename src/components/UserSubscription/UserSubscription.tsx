import * as React from 'react';

import readUserTrialStatus from '@/app/actions/subscription/readUserTrialStatus';

import { SubscriptionDetail } from '@/types';

import SubscriptionDetails from '@/components/SubscriptionDetails';
import SubscriptionSection from '@/components/SubscriptionSection';
import ViewPaymentDetails from '@/components/ViewPaymentDetails';
import TrialView from '@/components/TrialView';

async function UserSubscription({ subscriptionDetail }: { subscriptionDetail: SubscriptionDetail | undefined }) {
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
				<SubscriptionDetails subscriptionDetail={subscriptionDetail} subscriptionCanceled={subscriptionDetail.scheduledChange?.action === 'cancel'} />
			</SubscriptionSection>
			<SubscriptionSection
				title='Customer Portal'
				description='You can visit the Paddle Customer Portal to update payment methods, download invoices, view payment history, et cetera.'
			>
				<ViewPaymentDetails />
			</SubscriptionSection>
		</>
	);
}

export default UserSubscription;
