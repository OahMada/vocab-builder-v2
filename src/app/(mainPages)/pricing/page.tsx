import { Metadata } from 'next';
import * as React from 'react';
import { redirect } from 'next/navigation';

import checkSubscriptionStatus from '@/app/actions/user/checkSubscriptionStatus';

import { auth } from '@/auth';

import Wrapper from '@/components/PageWrapper';
import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import Icon from '@/components/Icon';
import Breadcrumb from '@/components/CustomBreadcrumb';
import { Button } from '@/components/Button';
import Pricing from '@/components/Pricing';
import Spacer from '@/components/Spacer';
import { Title, TitleWrapper, Description, PricingWrapper, RefundPolicyLink } from './StyledComponents';

export var metadata: Metadata = {
	title: 'Pricing | Vocab Builder',
};

export default async function PricingPage() {
	let session = await auth();
	if (session?.user && (!session.user.learningLanguage || !session.user.nativeLanguage)) {
		redirect('/personalize?callback=/pricing');
	}

	let isAuthenticated = Boolean(session?.user);

	if (session?.user.id) {
		let checkResult = await checkSubscriptionStatus(session?.user.id, false);
		if (checkResult) {
			redirect('/');
		}
	}

	return (
		<MaxWidthWrapper>
			<Wrapper $position='flex-start'>
				<Breadcrumb page='Pricing' link='/pricing' />
				<Spacer size={30} />
				<TitleWrapper>
					<Title>Build your vocabulary naturally, one sentence at a time.</Title>
					<Description>Every new user automatically receives a 3-day free trial, try out the app and see if it fits your needs.</Description>
				</TitleWrapper>
				{!isAuthenticated && (
					<Button variant='outline' href='/auth/login'>
						<Icon id='forward' />
						&nbsp; Start for Free
					</Button>
				)}
				<Spacer size={20} />
				<PricingWrapper>
					<TitleWrapper>
						<Title>{isAuthenticated ? 'Choose a Subscription Plan' : 'Or, Choose a Subscription Plan'}</Title>
						<Description>Unlimited API access for the duration of your subscription.</Description>
						<RefundPolicyLink href='/legal/terms#refunds' $underScored={true}>
							Refund Policy
						</RefundPolicyLink>
					</TitleWrapper>
					<Pricing isAuthenticated={isAuthenticated} />
				</PricingWrapper>
			</Wrapper>
		</MaxWidthWrapper>
	);
}
