'use client';

import * as React from 'react';

import getCustomerPortalSessionUrl from '@/app/actions/subscription/getCustomerPortalSessionUrl';

import { TOAST_ID } from '@/constants';

import { Button } from '@/components/Button';
import Icon from '@/components/Icon';
import { useGlobalToastContext } from '@/components/GlobalToastProvider';
import Loading from '@/components/Loading';

function ViewPaymentDetails() {
	let [loading, startTransition] = React.useTransition();
	let { addToToast } = useGlobalToastContext();

	function handleOnClick() {
		startTransition(async () => {
			let result = await getCustomerPortalSessionUrl();
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
		<Button variant='outline' onClick={handleOnClick}>
			{loading ? <Loading description='generating paddle customer portal url' /> : <Icon id='external-link' />}
			&nbsp;Visit Customer Portal
		</Button>
	);
}

export default ViewPaymentDetails;
