import { Metadata } from 'next';
import * as React from 'react';

import Wrapper from '@/components/PageWrapper';
import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import Icon from '@/components/Icon';
import Breadcrumb from '@/components/CustomBreadcrumb';
import Button from '@/components/Button';
import Pricing from '@/components/Pricing';
import Spacer from '@/components/Spacer';
import { Title, TitleWrapper, Description, PricingWrapper } from './StyledComponents';

export var metadata: Metadata = {
	title: 'Pricing | Vocab Builder',
};

export default function PricingPage() {
	return (
		<MaxWidthWrapper>
			<Wrapper $position='flex-start'>
				<Breadcrumb page='Pricing' link='/pricing' />
				<Spacer size={30} />
				<TitleWrapper>
					<Title>Build your vocabulary naturally, one sentence at a time.</Title>
					<Description>Every new user automatically receives a 7-day free trial, try out the app and see if it fits your needs.</Description>
				</TitleWrapper>
				<Button variant='outline' href='/auth/login'>
					<Icon id='forward' />
					&nbsp; Start for Free
				</Button>
				<Spacer size={20} />
				<PricingWrapper>
					<TitleWrapper>
						<Title>Or, Choose a Subscription Plan</Title>
						<Description>Unlimited API access for the duration of your subscription.</Description>
					</TitleWrapper>
					<Pricing />
				</PricingWrapper>
			</Wrapper>
		</MaxWidthWrapper>
	);
}
