import { Metadata } from 'next';
import * as React from 'react';
import { redirect } from 'next/navigation';

import getSubscriptionDetails from '@/app/actions/user/getSubscriptionDetails';

import { auth } from '@/auth';
import { SubscriptionDetail } from '@/types';

import Wrapper from '@/components/PageWrapper';
import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import UnauthorizedDisplay from '@/components/UnauthorizedDisplay';
import Breadcrumb from '@/components/CustomBreadcrumb';
import { TabsContent } from '@/components/Tabs';
import Tab from '@/components/AccountTab';
import UserSubscription from '@/components/UserSubscription';
import UserSetting from '@/components/UserSetting';

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

	// read subscription data
	let subscriptionDetail: SubscriptionDetail | undefined = undefined;
	let getSubscriptionResult = await getSubscriptionDetails();
	if ('error' in getSubscriptionResult) {
		throw new Error(getSubscriptionResult.error);
	} else {
		subscriptionDetail = getSubscriptionResult.data;
	}

	return (
		<MaxWidthWrapper>
			<Wrapper $position='flex-start'>
				<Breadcrumb page='Account' link='/account' />
				<Tab>
					<TabsContent value='settings'>
						<UserSetting
							user={{ name: session.user.name!, email: session.user.email!, id: session.user.id }}
							subScriptionIsActive={subscriptionDetail?.status === 'active'}
						/>
					</TabsContent>
					<TabsContent value='subscription'>
						<UserSubscription subscriptionDetail={subscriptionDetail} />
					</TabsContent>
				</Tab>
			</Wrapper>
		</MaxWidthWrapper>
	);
}
