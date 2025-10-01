'use client';

import * as React from 'react';

import syncWithAnki from '@/app/actions/sentence/syncWithAnki';

import { TOAST_ID } from '@/constants';

import Button from '@/components/Button';
import Icon from '@/components/Icon';
import { useGlobalToastContext } from '@/components/GlobalToastProvider';
import Loading from '@/components/Loading';

function SyncData() {
	let [isLoading, startTransition] = React.useTransition();
	let { addToToast } = useGlobalToastContext();
	async function handleExport() {
		startTransition(async () => {
			let result = await syncWithAnki();
			if (result && 'error' in result) {
				addToToast({
					contentType: 'error',
					content: result.error,
					id: TOAST_ID.SYNC_DATA,
				});
				return;
			}
			addToToast({
				contentType: 'notice',
				content: 'Success',
				id: TOAST_ID.SYNC_DATA,
			});
		});
	}
	return (
		<Button variant='outline' onClick={handleExport} disabled={isLoading}>
			{isLoading ? <Loading description='exporting data' /> : <Icon id='export' />}
			&nbsp; Sync Data
		</Button>
	);
}

export default SyncData;
