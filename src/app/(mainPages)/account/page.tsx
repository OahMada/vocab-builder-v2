import { Metadata } from 'next';
import * as React from 'react';
import { redirect } from 'next/navigation';

import readLastSyncedDate from '@/app/actions/user/readLastSyncedDate';

import { auth } from '@/auth';

import Wrapper from '@/components/PageWrapper';
import UserInfo from '@/components/UserInfo';
import UserPhoto from '@/components/UserPhoto';
import SyncData from '@/components/SyncData';
import DeleteAccount from '@/components/DeleteAccount';
import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import UnauthorizedDisplay from '@/components/UnauthorizedDisplay';
import PersonalizeUser from '@/components/PersonalizeUser';
import GoogleAccountLink from '@/components/GoogleAccountLink';
import Breadcrumb from '@/components/CustomBreadcrumb';
import { TabsContent } from '@/components/Tabs';
import Tab from './Tab';

export var metadata: Metadata = {
	title: 'Account | Vocab Builder',
};

export default async function AccountPage() {
	let session = await auth();
	if (!session?.user) {
		return (
			<MaxWidthWrapper>
				<UnauthorizedDisplay callback='/account' />;
			</MaxWidthWrapper>
		);
	} else if (!session.user.learningLanguage || !session.user.nativeLanguage) {
		redirect('/');
	}

	let errorText: string | undefined = undefined;
	let lastSynced: string | undefined = undefined;
	let lastSyncedResult = await readLastSyncedDate(session.user.id);

	if ('error' in lastSyncedResult) {
		errorText = lastSyncedResult.error;
	} else {
		lastSynced = lastSyncedResult.data;
	}

	return (
		<MaxWidthWrapper>
			<Wrapper $position='flex-start'>
				<Breadcrumb page='Account' link='/account' />
				<Tab>
					<TabsContent value='settings'>
						<UserPhoto />
						<UserInfo name={session.user.name!} email={session.user.email!} />
						<GoogleAccountLink />
						<PersonalizeUser showSubmitButton={false} hasName={Boolean(session.user.name)} />
						<SyncData errorText={errorText} lastSynced={lastSynced} />
						<DeleteAccount />
					</TabsContent>
					<TabsContent value='subscription'>Subscription</TabsContent>
				</Tab>
			</Wrapper>
		</MaxWidthWrapper>
	);
}
