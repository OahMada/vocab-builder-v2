import * as React from 'react';

import readLastSyncedDate from '@/app/actions/user/readLastSyncedDate';

import UserPhoto from '@/components/UserPhoto';
import UserInfo from '@/components/UserInfo';
import GoogleAccountLink from '@/components/GoogleAccountLink';
import PersonalizeUser from '@/components/PersonalizeUser';
import SyncData from '@/components/SyncData';
import DeleteAccount from '@/components/DeleteAccount';

async function UserSetting({ user }: { user: { name: string; email: string; id: string } }) {
	// read sync data
	let syncErrorText: string | undefined = undefined;
	let lastSynced: string | undefined = undefined;
	let lastSyncedResult = await readLastSyncedDate(user.id);

	if ('error' in lastSyncedResult) {
		syncErrorText = lastSyncedResult.error;
	} else {
		lastSynced = lastSyncedResult.data;
	}

	return (
		<>
			<UserPhoto />
			<UserInfo name={user.name} email={user.email} />
			<GoogleAccountLink />
			<PersonalizeUser showSubmitButton={false} hasName={Boolean(user.name)} />
			<SyncData errorText={syncErrorText} lastSynced={lastSynced} />
			<DeleteAccount />
		</>
	);
}

export default UserSetting;
