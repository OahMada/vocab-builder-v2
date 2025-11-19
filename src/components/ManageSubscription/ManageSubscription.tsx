'use client';
import styled from 'styled-components';
import * as React from 'react';

import cancelSubscription from '@/app/actions/subscription/cancelSubscription';
import reactiveSubscription from '@/app/actions/subscription/reactiveSubscription';

import { TOAST_ID } from '@/constants';

import { Button } from '@/components/Button';
import Icon from '@/components/Icon';
import AlertDialog from '@/components/AlertDialog';
import { useGlobalToastContext } from '@/components/GlobalToastProvider';
import DescriptionText from '@/components/DescriptionText';
import Loading from '@/components/Loading';

// TODO somehow let the page update

function ManageSubscription({ subscriptionCanceled, subscriptionActive }: { subscriptionCanceled: boolean; subscriptionActive: boolean }) {
	let { addToToast } = useGlobalToastContext();
	let [loading, startTransition] = React.useTransition();

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
			addToToast({
				id: TOAST_ID.CANCEL_SUBSCRIPTION,
				contentType: 'notice',
				content: result.data,
			});
		});
	}
	return (
		<>
			<Button variant='outline'>
				<Icon id='refresh' size={16} />
				&nbsp;Change Plan
			</Button>

			{subscriptionActive && (
				<>
					{subscriptionCanceled ? (
						<InnerWrapper>
							<WarningDesc>Subscription is scheduled to cancel.</WarningDesc>
							<Button variant='outline' onClick={handleUndoCancellation}>
								{/* TODO choose a better icon */}
								{loading ? <Loading description='Undo subscription cancellation' /> : <Icon id='play' size={16} />}
								&nbsp;Undo cancellation
							</Button>
						</InnerWrapper>
					) : (
						<AlertDialog
							description='Are you sure you want to cancel your subscription? You can keep using Vocab Builder until the end of your current billing period.'
							handleAction={handleCancelSubscription}
						>
							<CancelButton variant='outline' disabled={subscriptionCanceled}>
								<Icon id='x' />
								&nbsp;Cancel Subscription
							</CancelButton>
						</AlertDialog>
					)}
				</>
			)}
		</>
	);
}

export default ManageSubscription;

var CancelButton = styled(Button)`
	--text-color: var(--text-status-warning);
`;

var InnerWrapper = styled.div`
	display: flex;
	flex-direction: column;
	gap: 3px;
	align-items: center;
`;

var WarningDesc = styled(DescriptionText)`
	color: var(--text-status-warning);
`;
