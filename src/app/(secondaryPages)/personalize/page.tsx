import * as React from 'react';
import { redirect } from 'next/navigation';

import { auth } from '@/auth';

import PersonalizeUser from '@/components/PersonalizeUser';
import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import { Title, Wrapper } from './StyledComponents';
import Spacer from '@/components/Spacer';

// reference https://stackoverflow.com/questions/68103612/how-to-drop-the-query-parameters-after-a-redirect-with-nextjs?rq=2

export default async function PersonalizePage() {
	let session = await auth();
	if (!session?.user) {
		redirect('/auth/login');
	} else if (session.user.learningLanguage && session.user.nativeLanguage) {
		redirect('/');
	}


	let { learningLanguage, nativeLanguage, EnglishIPAFlavour, name } = session.user;

	return (
		<MaxWidthWrapper>
			<Wrapper>
				<Title>Before you start...</Title>
				<Spacer size={0} />
				<PersonalizeUser
					showSubmitButton={true}
					learningLanguage={learningLanguage || undefined}
					nativeLanguage={nativeLanguage || undefined}
					EnglishIPAFlavour={EnglishIPAFlavour || undefined}
					name={name || undefined}
				/>
			</Wrapper>
		</MaxWidthWrapper>
	);
}
