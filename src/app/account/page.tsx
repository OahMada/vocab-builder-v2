import * as React from 'react';
import Wrapper from '@/components/PageWrapper';
import Breadcrumb from './CustomBreadcrumb';
import UserInfo from '@/components/UserInfo';
import Spacer from '@/components/Spacer';
import UserPhoto from '@/components/UserPhoto';
import InnerWrapper from './InnerWrapper';
import ChooseLanguage from '@/components/ChooseLanguage';
import ChooseIPAFlavour from '@/components/ChooseIPAFlavour';
import ExportData from '@/components/ExportData';
import DeleteAccount from '@/components/DeleteAccount';
import MaxWidthWrapper from '@/components/MaxWidthWrapper';

export default function AccountPage() {
	return (
		<MaxWidthWrapper>
			<Wrapper $position='flex-start'>
				<Breadcrumb />
				<Spacer size={1} />
				<UserPhoto />
				<Spacer size={1} />
				<UserInfo />
				<Spacer size={1} />
				<InnerWrapper>
					<ChooseLanguage />
					<ChooseIPAFlavour />
				</InnerWrapper>
				<Spacer size={1} />
				<ExportData />
				<DeleteAccount />
			</Wrapper>
		</MaxWidthWrapper>
	);
}
