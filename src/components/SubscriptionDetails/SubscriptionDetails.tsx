'use client';

import * as React from 'react';
import styled from 'styled-components';

import { SubscriptionDetail } from '@/types';
import { PRICE_TIER } from '@/constants';
import { getLocalDateString } from '@/utils';
import { usePaddlePrices } from '@/hooks';

import PricePlaceHolder from '@/components/PricePlaceHolder';

// TODO error boundary

function SubscriptionDetails({ subscriptionDetail, errorText }: { subscriptionDetail: SubscriptionDetail; errorText?: string }) {
	let [nextBillingDateString, setNextBillingBateString] = React.useState<undefined | string>(undefined);
	let [scheduledChangeDateString, setScheduledChangeDateString] = React.useState<undefined | string>(undefined);
	let { loading, priceMap } = usePaddlePrices();

	let { nextBillingAt, priceId, status, scheduledChange } = subscriptionDetail;
	let priceDetail = PRICE_TIER.find((item) => item.priceId === priceId);
	if (!priceDetail) {
		throw new Error('No matching priceId provided');
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

	if (errorText) return <ErrorText>errorText</ErrorText>;
	if (!subscriptionDetail) return <p>No active subscription</p>;

	return (
		<Wrapper>
			<DataLabel>Your Plan:</DataLabel>
			<DataValue>{priceDetail.name}</DataValue>
			<DataLabel>Price:</DataLabel>
			<DataValue>
				{loading ? <PricePlaceHolder style={{ '--width': '48px', '--height': '20px' } as React.CSSProperties} /> : priceMap[priceId]}&nbsp;
				{priceDetail.billingCycle}
			</DataValue>
			<DataLabel>Subscription status:</DataLabel>
			<CappedDataValue>{status}</CappedDataValue>
			{nextBillingAt ? (
				<>
					<DataLabel>Next billing date:</DataLabel>
					<DataValue>{nextBillingDateString}</DataValue>
				</>
			) : (
				<>
					<WarningDataLabel>Expires at:</WarningDataLabel>
					<WarningDataValue>{scheduledChangeDateString}</WarningDataValue>
				</>
			)}
		</Wrapper>
	);
}

export default SubscriptionDetails;

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
var ErrorText = styled.p`
	color: var(--text-status-warning);
`;

var WarningDataLabel = styled(DataLabel)`
	color: var(--text-status-warning);
`;

var WarningDataValue = styled(DataValue)`
	color: var(--text-status-warning);
`;
