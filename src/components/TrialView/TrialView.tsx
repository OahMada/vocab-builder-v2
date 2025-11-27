'use client';

import * as React from 'react';
import styled from 'styled-components';

import { TrialStatus } from '@/types';
import { getLocalDateString } from '@/utils';

import { Button } from '@/components/Button';
import Icon from '@/components/Icon';

function TrialView({ trialStatus }: { trialStatus: TrialStatus }) {
	let { expireDate, status } = trialStatus;
	let [trialEndsDateString, setTrialEndsDateString] = React.useState('');

	React.useEffect(() => {
		setTrialEndsDateString(getLocalDateString(expireDate, false));
	}, [expireDate]);

	return (
		<Wrapper>
			<p>You don&apos;t have an active Subscription yet.</p>
			{status === 'active' && <p>Free trial ends at: {trialEndsDateString}</p>}
			{status === 'expired' && <WarningText>Free trial ended at: {trialEndsDateString}</WarningText>}
			<ChoosePlanButton variant='outline' href='/pricing'>
				<Icon id='forward' />
				&nbsp;Choose a plan
			</ChoosePlanButton>
		</Wrapper>
	);
}

export default TrialView;

var Wrapper = styled.div`
	display: flex;
	flex-direction: column;
	gap: 12px;
	align-items: center;
`;

var ChoosePlanButton = styled(Button)`
	margin-top: 30px;
`;

var WarningText = styled.p`
	color: var(--text-status-warning);
`;
