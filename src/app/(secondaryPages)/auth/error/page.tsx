import * as React from 'react';
import { Metadata } from 'next';
import { SearchParams } from 'nuqs/server';
import { redirect } from 'next/navigation';

import { auth } from '@/auth';

import Wrapper from '@/components/PageWrapper';
import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import Icon from '@/components/Icon';
import NavLink from '@/components/NavLink';
import { ErrorCode, InnerWrapper, MessageWrapper, SecondaryText, Title } from './StyledComponents';

export var metadata: Metadata = {
	title: 'Auth Error | Vocab Builder',
};

const ErrorCodes = {
	Configuration: 'Configuration',
	AccessDenied: 'AccessDenied',
	Verification: 'Verification',
	Default: 'Default',
} as const;

var errorMap = {
	[ErrorCodes.Configuration]: (
		<>
			<p>There was a problem when trying to authenticate. Please contact us if this error persists. </p>
			<SecondaryText>
				Unique error code: <ErrorCode>Configuration</ErrorCode>
			</SecondaryText>
		</>
	),
	[ErrorCodes.Verification]: (
		<>
			<p>The verification link is invalid or has expired. Please try signing in again to request a new link.</p>
			<p>
				Unique error code:
				<ErrorCode>Verification</ErrorCode>
			</p>
		</>
	),

	[ErrorCodes.AccessDenied]: (
		<>
			<p>
				You don&apos;t have permission to sign in. This usually happens if your account doesn&apos;t meet the requirements (for example, restricted
				email domain or missing role).
			</p>
			<SecondaryText>
				Unique error code: <ErrorCode>AccessDenied</ErrorCode>
			</SecondaryText>
		</>
	),

	[ErrorCodes.Default]: (
		<>
			<p>Something went wrong during authentication. Please try again, and contact support if the issue continues. </p>
			<SecondaryText>
				Unique error code: <ErrorCode>Default</ErrorCode>
			</SecondaryText>
		</>
	),
};

export default async function AuthErrorPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
	let session = await auth();

	if (session?.user) {
		redirect('/');
	}

	let result = await searchParams;
	let error = result.error as keyof typeof ErrorCodes;

	return (
		<MaxWidthWrapper>
			<Wrapper $position='center'>
				<Title>Something went wrong</Title>
				<MessageWrapper>{errorMap[error] || 'Please contact us if this error persists.'}</MessageWrapper>
				<InnerWrapper>
					<Icon id='forward' size={14} />
					&nbsp;
					<NavLink href='/auth/login'>Retry Login</NavLink>
				</InnerWrapper>
			</Wrapper>
		</MaxWidthWrapper>
	);
}
