'use client';

import * as React from 'react';
import styled from 'styled-components';

import syncWithAnki from '@/app/actions/anki/syncWithAnki';

import { TOAST_ID } from '@/constants';

import Button from '@/components/Button';
import Icon from '@/components/Icon';
import { useGlobalToastContext } from '@/components/GlobalToastProvider';
import Loading from '@/components/Loading';
import DescriptionText from '@/components/DescriptionText';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/Popover';
import VisuallyHidden from '@/components/VisuallyHidden';

function SyncData({ lastSynced, errorText }: { lastSynced: string; errorText: string | undefined }) {
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
				content: result.data,
				id: TOAST_ID.SYNC_DATA,
				title: 'Success',
			});
		});
	}
	return (
		<Wrapper>
			<InnerWrapper>
				<TimeStamp>Last synced: {lastSynced || errorText}</TimeStamp>
				<Popover>
					<PopoverTrigger asChild={true}>
						<Button variant='icon'>
							<Icon id='info' size={12} />
							<VisuallyHidden>Notice</VisuallyHidden>
						</Button>
					</PopoverTrigger>
					<PopoverContent>
						<DescriptionText>You need a computer running Anki Desktop with the AnkiConnect add-on installed to perform this action.</DescriptionText>
					</PopoverContent>
				</Popover>
			</InnerWrapper>
			<Button variant='outline' onClick={handleExport} disabled={isLoading}>
				{isLoading ? <Loading description='exporting data' /> : <Icon id='export' />}
				&nbsp; Sync Data
			</Button>
		</Wrapper>
	);
}

export default SyncData;

var Wrapper = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
`;

var InnerWrapper = styled.div`
	display: flex;
	gap: 3px;
	align-items: center;
`;

var TimeStamp = styled(DescriptionText)`
	color: var(--text-tertiary);
	font-size: 12px;
`;
