'use client';

import * as React from 'react';
import { saveAs } from 'file-saver';

import exportData from '@/app/actions/sentence/exportData';

import { TOAST_ID } from '@/constants';

import Button from '@/components/Button';
import Icon from '@/components/Icon';
import { useGlobalToastContext } from '@/components/GlobalToastProvider';
import Loading from '@/components/Loading';

function ExportData() {
	let [isLoading, startTransition] = React.useTransition();
	let { addToToast } = useGlobalToastContext();
	async function handleExport() {
		startTransition(async () => {
			let result = await exportData();
			if ('error' in result) {
				addToToast({
					contentType: 'error',
					content: result.error,
					id: TOAST_ID.EXPORT_DATA,
				});
				return;
			}

			let blob = new Blob([result.data], { type: 'text/plain;charset=utf-8' });
			saveAs(blob, 'data.json');
		});
	}
	return (
		<Button variant='outline' onClick={handleExport} disabled={isLoading}>
			{isLoading ? <Loading description='exporting data' /> : <Icon id='export' />}
			&nbsp; Export Data
		</Button>
	);
}

export default ExportData;
