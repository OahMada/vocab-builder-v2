import { Metadata } from 'next';
import * as React from 'react';
import { redirect } from 'next/navigation';
import dayjs from 'dayjs';

import readLastExportedDate from '@/app/actions/user/readLastExportedDate';

import { auth } from '@/auth';

import Wrapper from '@/components/PageWrapper';
import UserInfo from '@/components/UserInfo';
import UserPhoto from '@/components/UserPhoto';
import ExportData from '@/components/ExportData';
import DeleteAccount from '@/components/DeleteAccount';
import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import UnauthorizedDisplay from '@/components/UnauthorizedDisplay';
import PersonalizeUser from '@/components/PersonalizeUser';
import GoogleAccountLink from '@/components/GoogleAccountLink';
import Breadcrumb from './CustomBreadcrumb';

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
	let lastExported: string = 'never';
	let lastExportedResult = await readLastExportedDate(session.user.id);
	if ('error' in lastExportedResult) {
		errorText = lastExportedResult.error;
	} else if (lastExportedResult.data) {
		lastExported = dayjs(lastExportedResult.data).format('YYYY-MM-DD HH:mm');
	}

	return (
		<MaxWidthWrapper>
			<Wrapper $position='center'>
				<Breadcrumb />
				<UserPhoto />
				<UserInfo />
				<GoogleAccountLink />
				<PersonalizeUser showSubmitButton={false} hasName={Boolean(session.user.name)} />
				<ExportData errorText={errorText} lastExported={lastExported} />
				<DeleteAccount />
			</Wrapper>
		</MaxWidthWrapper>
	);
}
