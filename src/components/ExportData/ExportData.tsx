'use client';

import * as React from 'react';
import styled from 'styled-components';
import { saveAs } from 'file-saver';

import exportData from '@/app/actions/sentence/exportData';

import { TOAST_ID } from '@/constants';

import Button from '@/components/Button';
import Icon from '@/components/Icon';
import { useGlobalToastContext } from '@/components/GlobalToastProvider';
import Loading from '@/components/Loading';
import DescriptionText from '@/components/DescriptionText';

function ExportData({ lastExported, errorText }: { lastExported: string; errorText: string | undefined }) {
	let [isLoading, startTransition] = React.useTransition();
	let { addToToast } = useGlobalToastContext();
	async function handleExport() {
		startTransition(async () => {
			let result = await exportData();
			if (result && 'error' in result) {
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
		<Wrapper>
			<TimeStamp>Last exported: {lastExported || errorText}</TimeStamp>
			<Button variant='outline' onClick={handleExport} disabled={isLoading}>
				{isLoading ? <Loading description='exporting data' /> : <Icon id='export' />}
				&nbsp; Export Data
			</Button>
		</Wrapper>
	);
}

export default ExportData;

var Wrapper = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
`;

var TimeStamp = styled(DescriptionText)`
	color: var(--text-secondary);
	font-size: 12px;
`;
