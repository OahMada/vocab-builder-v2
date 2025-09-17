import { Metadata } from 'next';
import * as React from 'react';
import { redirect } from 'next/navigation';

import { auth } from '@/auth';

import Wrapper from '@/components/PageWrapper';
import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import Login from '@/components/Login';

export var metadata: Metadata = {
	title: 'Login | Vocab Builder',
};

export default async function IntroPage() {
	let session = await auth();
	if (session?.user) {
		redirect('/');
	}

	return (
		<MaxWidthWrapper>
			<Wrapper $position='center'>
				<Login />
			</Wrapper>
		</MaxWidthWrapper>
	);
}
