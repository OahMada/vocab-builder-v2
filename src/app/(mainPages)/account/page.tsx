import { Metadata } from 'next';
import * as React from 'react';
import { redirect } from 'next/navigation';

import { auth } from '@/auth';

import Wrapper from '@/components/PageWrapper';
import UserInfo from '@/components/UserInfo';
import UserPhoto from '@/components/UserPhoto';
import ExportData from '@/components/ExportData';
import DeleteAccount from '@/components/DeleteAccount';
import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import Breadcrumb from './CustomBreadcrumb';
import UnauthorizedDisplay from '@/components/UnauthorizedDisplay';
import PersonalizeUser from '@/components/PersonalizeUser';
import GoogleAccountLink from '@/components/GoogleAccountLink';

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

	let { EnglishIPAFlavour, learningLanguage, nativeLanguage, name } = session.user;

	return (
		<MaxWidthWrapper>
			<Wrapper $position='center'>
				<Breadcrumb />
				<UserPhoto />
				<UserInfo />
				<GoogleAccountLink userId={session.user.id} />
				<PersonalizeUser
					showSubmitButton={false}
					learningLanguage={learningLanguage}
					nativeLanguage={nativeLanguage}
					EnglishIPAFlavour={EnglishIPAFlavour || undefined}
					name={name || undefined}
				/>
				<ExportData />
				<DeleteAccount />
			</Wrapper>
		</MaxWidthWrapper>
	);
}
