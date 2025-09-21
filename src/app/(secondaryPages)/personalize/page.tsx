import * as React from 'react';
import { redirect } from 'next/navigation';

import { auth } from '@/auth';

import PersonalizeUser from '@/components/PersonalizeUser';
import MaxWidthWrapper from '@/components/MaxWidthWrapper';

// reference https://stackoverflow.com/questions/68103612/how-to-drop-the-query-parameters-after-a-redirect-with-nextjs?rq=2

export default async function PersonalizePage() {
	let session = await auth();
	if (!session?.user) {
		redirect('/auth/login');
	} else if (session.user.learningLanguage && session.user.nativeLanguage) {
		redirect('/');
	}

	return (
		<MaxWidthWrapper>
			<PersonalizeUser hasName={Boolean(session.user.name)} />
		</MaxWidthWrapper>
	);
}
