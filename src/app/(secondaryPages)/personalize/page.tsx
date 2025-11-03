import * as React from 'react';
import { redirect } from 'next/navigation';

import { auth } from '@/auth';

import PersonalizeUser from '@/components/PersonalizeUser';
import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import Spacer from '@/components/Spacer';
import { Title, Wrapper } from './StyledComponents';

interface SearchParams {
	callback: string;
	[key: string]: string | string[];
}

// reference https://stackoverflow.com/questions/68103612/how-to-drop-the-query-parameters-after-a-redirect-with-nextjs?rq=2

export default async function PersonalizePage({ searchParams }: { searchParams: Promise<SearchParams> }) {
	let session = await auth();
	if (!session?.user) {
		redirect('/auth/login');
	} else if (session.user.learningLanguage && session.user.nativeLanguage) {
		redirect('/');
	}

	let { callback } = await searchParams;

	return (
		<MaxWidthWrapper>
			<Wrapper>
				<Title>Before you start...</Title>
				<Spacer size={0} />
				<PersonalizeUser showSubmitButton={true} hasName={Boolean(session.user.name)} callback={callback as string | undefined} />
			</Wrapper>
		</MaxWidthWrapper>
	);
}
