import { Metadata } from 'next';
import * as React from 'react';
import { redirect } from 'next/navigation';

import { auth } from '@/auth';

import Wrapper from '@/components/PageWrapper';
import UserInfo from '@/components/UserInfo';
import UserPhoto from '@/components/UserPhoto';
import ChooseLanguage from '@/components/ChooseLanguage';
import ChooseIPAFlavour from '@/components/ChooseIPAFlavour';
import ExportData from '@/components/ExportData';
import DeleteAccount from '@/components/DeleteAccount';
import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import InnerWrapper from './InnerWrapper';
import Breadcrumb from './CustomBreadcrumb';
import UnauthorizedDisplay from '@/components/UnauthorizedDisplay';

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

	return (
		<MaxWidthWrapper>
			<Wrapper $position='center'>
				<Breadcrumb />
				<UserPhoto />
				<UserInfo />
				<InnerWrapper>
					<ChooseLanguage type='learning' />
					<ChooseLanguage type='translation' />
					{session.user.EnglishIPAFlavour && <ChooseIPAFlavour />}
				</InnerWrapper>
				<ExportData />
				<DeleteAccount />
			</Wrapper>
		</MaxWidthWrapper>
	);
}
