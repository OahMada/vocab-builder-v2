import * as React from 'react';
import Wrapper from '@/components/PageWrapper';
import Breadcrumb from './CustomBreadcrumb';
import UserInfo from '@/components/UserInfo';
import Spacer from '@/components/Spacer';
import AccountUser from '@/components/AccountUser';
import InnerWrapper from './InnerWrapper';
import ChooseLanguage from '@/components/ChooseLanguage';
import ChooseIPAFlavour from '@/components/ChooseIPAFlavour';
import ExportData from '@/components/ExportData';
import DeleteAccount from '@/components/DeleteAccount';
import MaxWidthWrapper from '@/components/MaxWidthWrapper';

export default function AccountPage() {
	return (
		<MaxWidthWrapper>
			<Wrapper $position='center'>
				<Breadcrumb />
				<AccountUser />
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
