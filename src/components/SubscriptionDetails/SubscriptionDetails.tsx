'use client';

import * as React from 'react';
import styled from 'styled-components';
import { FallbackProps, withErrorBoundary } from 'react-error-boundary';

import cancelSubscription from '@/app/actions/subscription/cancelSubscription';
import reactiveSubscription from '@/app/actions/subscription/reactiveSubscription';

import { SubscriptionDetail } from '@/types';
import { PRICE_TIER, TOAST_ID } from '@/constants';
import { getLocalDateString, handleError } from '@/utils';
import { usePaddlePrices } from '@/hooks';

import PricePlaceHolder from '@/components/PricePlaceHolder';
import { Button } from '@/components/Button';
import Loading from '@/components/Loading';
import AlertDialog from '@/components/AlertDialog';
import { useGlobalToastContext } from '@/components/GlobalToastProvider';
import Icon from '@/components/Icon';
import { ErrorTitle, ErrorText } from '@/components/ErrorDisplay';

function SubscriptionDetails({ subscriptionDetail }: { subscriptionDetail: SubscriptionDetail }) {
	let [scheduledToCanceled, setScheduledToCanceled] = React.useState(subscriptionDetail.scheduledChange?.action === 'cancel');

	let [nextBillingDateString, setNextBillingBateString] = React.useState<undefined | string>(undefined);
	let [scheduledChangeDateString, setScheduledChangeDateString] = React.useState<undefined | string>(undefined);
	let [cancelledOrPastDueDateString, setCancelledOrPastDueDateString] = React.useState<undefined | string>(undefined);
	let { loading: priceLoading, priceMap } = usePaddlePrices();

	let { nextBillingAt, priceId, status, scheduledChange, occurredAt } = subscriptionDetail;
	let priceDetail = PRICE_TIER.find((item) => item.priceId === priceId);
	if (!priceDetail) {
		throw new Error('No matching priceId provided');
	}

	let { addToToast } = useGlobalToastContext();
	let [manageSubscriptionLoading, startTransition] = React.useTransition();

	async function handleCancelSubscription() {
		let result = await cancelSubscription();
		if ('error' in result) {
			addToToast({
				id: TOAST_ID.CANCEL_SUBSCRIPTION,
				contentType: 'error',
				content: result.error,
			});
			return;
		}
		setScheduledToCanceled(true);
		addToToast({
			id: TOAST_ID.CANCEL_SUBSCRIPTION,
			contentType: 'notice',
			content: result.data,
		});
	}

	function handleUndoCancellation() {
		startTransition(async () => {
			let result = await reactiveSubscription();
			if ('error' in result) {
				addToToast({
					id: TOAST_ID.CANCEL_SUBSCRIPTION,
					contentType: 'error',
					content: result.error,
				});
				return;
			}
			setScheduledToCanceled(false);
			addToToast({
				id: TOAST_ID.CANCEL_SUBSCRIPTION,
				contentType: 'notice',
				content: result.data,
			});
		});
	}

	// to avoid client-server mismatch
	React.useEffect(() => {
		if (!nextBillingAt) {
			setNextBillingBateString(undefined);
		} else {
			setNextBillingBateString(getLocalDateString(nextBillingAt, false));
		}
	}, [nextBillingAt]);

	React.useEffect(() => {
		if (!scheduledChange) {
			setScheduledChangeDateString(undefined);
		} else {
			setScheduledChangeDateString(getLocalDateString(scheduledChange.effectiveAt, false));
		}
	}, [scheduledChange]);

	React.useEffect(() => {
		setCancelledOrPastDueDateString(getLocalDateString(occurredAt, false));
	}, [occurredAt]);

	return (
		<Wrapper>
			<DataLabel>Your Plan:</DataLabel>
			<DataValue>{priceDetail.name}</DataValue>
			<DataLabel>Price:</DataLabel>
			<DataValue>
				{priceLoading ? <PricePlaceHolder style={{ '--width': '48px', '--height': '20px' } as React.CSSProperties} /> : priceMap[priceId]}&nbsp;
				{priceDetail.billingCycle}
			</DataValue>
			<DataLabel>Subscription status:</DataLabel>
			<CappedDataValue>{status}</CappedDataValue>
			{!scheduledToCanceled && subscriptionDetail.status === 'active' && (
				<>
					<DataLabel>Next billing date:</DataLabel>
					<DataValue>{nextBillingDateString || scheduledChangeDateString}</DataValue>
					<AlertDialog
						description='Are you sure you want to cancel your subscription? You can keep using Vocab Builder until the end of your current billing period.'
						handleAction={handleCancelSubscription}
					>
						<CancelButton variant='outline'>
							<Icon id='x' />
							&nbsp;Cancel Subscription
						</CancelButton>
					</AlertDialog>
				</>
			)}
			{subscriptionDetail.status === 'past_due' && (
				<>
					<DataLabel>Expired at:</DataLabel>
					<DataValue>{cancelledOrPastDueDateString}</DataValue>
				</>
			)}
			{subscriptionDetail.status === 'active' && scheduledToCanceled && (
				<>
					<WarningDataLabel>Expires at:</WarningDataLabel>
					{/* show nextBillingDateString before server data arrive */}
					<WarningDataValue>{scheduledChangeDateString || nextBillingDateString}</WarningDataValue>
					<UndoCancellationButton variant='outline' onClick={handleUndoCancellation} disabled={manageSubscriptionLoading}>
						{manageSubscriptionLoading ? <Loading description='Undo subscription cancellation' /> : <Icon id='undo' />}
						&nbsp;Undo Cancellation
					</UndoCancellationButton>
				</>
			)}
			{subscriptionDetail.status === 'canceled' && (
				<>
					<WarningDataLabel>Expired at:</WarningDataLabel>
					<WarningDataValue>{cancelledOrPastDueDateString}</WarningDataValue>
					<ChoosePlanButton variant='outline' href='/pricing'>
						<Icon id='forward' />
						&nbsp;Choose a plan
					</ChoosePlanButton>
				</>
			)}
		</Wrapper>
	);
}

var SubscriptionDetailsWithErrorBoundary = withErrorBoundary(SubscriptionDetails, {
	FallbackComponent: Fallback,
});

function Fallback({ error }: FallbackProps) {
	let errorMsg = handleError(error);
	return (
		<ErrorWrapper>
			<ErrorTitle>An Error Occurred</ErrorTitle>
			<ErrorText>{errorMsg}</ErrorText>
		</ErrorWrapper>
	);
}

export default SubscriptionDetailsWithErrorBoundary;

var Wrapper = styled.div`
	display: grid;
	grid-template-columns: 1fr 1fr;
	row-gap: 12px;
	column-gap: 24px;
	align-items: center;
`;

var DataLabel = styled.div`
	color: var(--text-secondary);
	text-align: right;
`;

var DataValue = styled.div`
	display: flex;
	align-items: center;
`;

var CappedDataValue = styled(DataValue)`
	text-transform: capitalize;
`;

var WarningDataLabel = styled(DataLabel)`
	color: var(--text-status-warning);
`;

var WarningDataValue = styled(DataValue)`
	color: var(--text-status-warning);
`;

var UndoCancellationButton = styled(Button)`
	grid-column: 1 / -1;
	justify-self: center;
`;

var CancelButton = styled(UndoCancellationButton)`
	--text-color: var(--text-status-warning);
`;

var ChoosePlanButton = styled(UndoCancellationButton)``;

var ErrorWrapper = styled.div`
	text-align: center;
`;
