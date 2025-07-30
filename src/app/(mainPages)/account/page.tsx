import { Metadata } from 'next';
import * as React from 'react';
import Wrapper from '@/components/PageWrapper';
import Breadcrumb from './CustomBreadcrumb';
import UserInfo from '@/components/UserInfo';
import UserPhoto from '@/components/UserPhoto';
import InnerWrapper from './InnerWrapper';
import ChooseLanguage from '@/components/ChooseLanguage';
import ChooseIPAFlavour from '@/components/ChooseIPAFlavour';
import ExportData from '@/components/ExportData';
import DeleteAccount from '@/components/DeleteAccount';
import MaxWidthWrapper from '@/components/MaxWidthWrapper';

export var metadata: Metadata = {
	title: 'Account | Vocab Builder',
};

export default function AccountPage() {
	return (
		<MaxWidthWrapper>
			<Wrapper $position='center'>
				<Breadcrumb />
				<UserPhoto />
				<UserInfo />
				<InnerWrapper>
					<ChooseLanguage />
					<ChooseIPAFlavour />
				</InnerWrapper>
				<ExportData />
				<DeleteAccount />
			</Wrapper>
		</MaxWidthWrapper>
	);
}
