import { Metadata } from 'next';
import * as React from 'react';
import { redirect } from 'next/navigation';
import { SearchParams } from 'nuqs/server';

import { auth } from '@/auth';

import Wrapper from '@/components/PageWrapper';
import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import Login from '@/components/Login';

export var metadata: Metadata = {
	title: 'Login | Vocab Builder',
};

export default async function LoginPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
	let session = await auth();
	if (session?.user) {
		redirect('/');
	}

	let { error } = await searchParams;

	return (
		<MaxWidthWrapper>
			<Wrapper $position='center'>
				<Login error={(error as string) || undefined} />
			</Wrapper>
		</MaxWidthWrapper>
	);
}
