'use client';

import * as React from 'react';
import styled from 'styled-components';

import exportData from '@/app/actions/sentence/exportData';

import { TOAST_ID } from '@/constants';
import { useIsHoverable } from '@/hooks';
import { getLocalDateString } from '@/utils';
import { postMessage } from '@/lib';

import { Button } from '@/components/Button';
import Icon from '@/components/Icon';
import { useGlobalToastContext } from '@/components/GlobalToastProvider';
import Loading from '@/components/Loading';
import DescriptionText from '@/components/DescriptionText';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/Popover';
import VisuallyHidden from '@/components/VisuallyHidden';
import NavLink from '@/components/NavLink';

function SyncData({ lastSynced, errorText }: { lastSynced: string | undefined; errorText: string | undefined }) {
	let [isLoading, startTransition] = React.useTransition();
	let [lastSyncedDateString, setLastSyncedDateString] = React.useState('');
	let { addToToast } = useGlobalToastContext();
	let isHoverable = useIsHoverable();

	async function handleExport() {
		startTransition(async () => {
			let result = await exportData();
			if (result && 'error' in result) {
				addToToast({
					contentType: 'error',
					content: result.error,
					id: TOAST_ID.SYNC_DATA,
				});
				return;
			}
			let resp = await postMessage(result.data);
			if (resp?.syncing) {
				addToToast({
					contentType: 'notice',
					content: 'A system notification will appear to show the sync result.',
					id: TOAST_ID.SYNC_DATA,
					title: 'Syncing started',
				});
			} else {
				addToToast({
					contentType: 'error',
					content: "Please make sure you've installed the Vocab Builder Sync extension.",
					id: TOAST_ID.SYNC_DATA,
					title: 'Syncing could not start',
				});
			}
		});
	}

	// to avoid client-server mismatch
	React.useEffect(() => {
		if (!lastSynced) {
			setLastSyncedDateString('never');
		} else {
			setLastSyncedDateString(getLocalDateString(lastSynced));
		}
	}, [lastSynced]);

	return (
		<Wrapper>
			<InnerWrapper>
				<TimeStamp>Last synced: {lastSyncedDateString || <ErrorText>{errorText}</ErrorText>}</TimeStamp>
				<Popover>
					<PopoverTrigger asChild={true}>
						<Button variant='icon'>
							<Icon id='info' size={16} />
							<VisuallyHidden>Notice</VisuallyHidden>
						</Button>
					</PopoverTrigger>
					<PopoverContent>
						<DescriptionText>
							Make sure you&apos;ve installed the Vocab Builder Sync browser extension before syncing, and that you are on a computer.{' '}
							<NavLink href='/sync' $underScored={true}>
								Learn more
							</NavLink>
							.
						</DescriptionText>
					</PopoverContent>
				</Popover>
			</InnerWrapper>

			<Button variant='outline' onClick={handleExport} disabled={isLoading || !isHoverable}>
				{isLoading ? <Loading description='exporting data' /> : <Icon id='sync' size={15} />}
				&nbsp; Sync With Anki
			</Button>
		</Wrapper>
	);
}

export default SyncData;

var Wrapper = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 5px;
`;

var TimeStamp = styled(DescriptionText)`
	color: var(--text-secondary);
	font-size: 12px;
`;

var InnerWrapper = styled.div`
	display: flex;
	align-items: center;
	gap: 5px;
	transform: translateX(5px);
`;

var ErrorText = styled.span`
	color: var(--text-status-warning);
`;
