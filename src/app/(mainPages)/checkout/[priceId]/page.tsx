import * as React from 'react';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';

import checkSubscriptionStatus from '@/app/actions/user/checkSubscriptionStatus';

import { auth } from '@/auth';
import getCookie from '@/lib/getCookie';
import { Theme } from '@/types';

import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import Wrapper from '@/components/PageWrapper';
import Breadcrumb from '@/components/CustomBreadcrumb';
import Checkout from '@/components/Checkout';

export var metadata: Metadata = {
	title: 'Checkout | Vocab Builder',
};

export default async function checkoutPage({ params }: { params: Promise<{ priceId: string }> }) {
	let { priceId } = await params;
	let session = await auth();
	if (!session?.user) {
		redirect('/pricing');
	}

	if (session?.user.id) {
		let checkResult = await checkSubscriptionStatus(session?.user.id);
		if (checkResult) {
			redirect('/');
		}
	}

	let savedTheme = await getCookie('color-theme');
	let theme = (savedTheme || 'dark') as Theme;

	let email = session.user.email as string;
	let userId = session.user.id;

	return (
		<MaxWidthWrapper>
			<Wrapper $position='flex-start'>
				<Breadcrumb page='Pricing' link='/pricing' />
				<Checkout priceId={priceId} userInfo={{ email, userId }} initialTheme={theme} />
			</Wrapper>
		</MaxWidthWrapper>
	);
}
