'use client';

import * as React from 'react';

import unlinkGoogleAccount from '@/app/actions/auth/unlinkGoogleAccount';
import googleLogin from '@/app/actions/auth/googleLogin';

import { TOAST_ID } from '@/constants';

import Button from '@/components/Button';
import Icon from '@/components/Icon';
import Loading from '@/components/Loading';
import { useGlobalToastContext } from '@/components/GlobalToastProvider';
import AlertDialog from '@/components/AlertDialog';

export default function ChangeAccountLinkStatus({ accountLinked }: { accountLinked: boolean }) {
	let [isAccountLinked, setIsAccountLinked] = React.useState(accountLinked);
	let [isLoading, startTransition] = React.useTransition();
	let { addToToast } = useGlobalToastContext();

	function handleLinkAccount() {
		startTransition(async () => {
			// user will be thrown to home page if not succeeded
			let result = await googleLogin('/account');
			if (result && 'error' in result) {
				addToToast({
					content: result.error,
					contentType: 'error',
					id: TOAST_ID.ACCOUNT_LINK,
				});
				return;
			}
		});
	}

	async function handleUnlinkAccount() {
		let result = await unlinkGoogleAccount();
		if ('error' in result) {
			addToToast({
				content: result.error,
				contentType: 'error',
				id: TOAST_ID.ACCOUNT_LINK,
			});
			return;
		}
		addToToast({
			contentType: 'notice',
			content: result.data,
			id: TOAST_ID.ACCOUNT_LINK,
		});
		setIsAccountLinked(false);
	}

	return isAccountLinked ? (
		<AlertDialog
			description='Are you sure? You will no longer be able to log in with Google if you disconnect your account.'
			handleAction={handleUnlinkAccount}
		>
			<Button variant='outline' disabled={isLoading}>
				<Icon id='link' />
				&nbsp; Unlink Google Account
			</Button>
		</AlertDialog>
	) : (
		<Button variant='outline' disabled={true} onClick={handleLinkAccount}>
			{isLoading ? <Loading description='Linking google account' /> : <Icon id='link' />}
			&nbsp; Link Google Account
		</Button>
	);
}
