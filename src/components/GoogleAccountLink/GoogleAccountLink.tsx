import * as React from 'react';

import checkAccountLinkStatus from '@/app/actions/auth/checkAccountLinkStatus';

import ChangeAccountLinkStatus from './ChangeAccountLinkStatus';

async function GoogleAccountLink({ userId }: { userId: string }) {
	let result = await checkAccountLinkStatus(userId);

	if ('error' in result) {
		return 'Error checking Google account link status';
	}
	let accountLinked: boolean = Boolean(result.data);

	return <ChangeAccountLinkStatus accountLinked={accountLinked} />;
}

export default GoogleAccountLink;
