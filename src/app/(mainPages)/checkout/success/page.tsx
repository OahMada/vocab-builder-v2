import * as React from 'react';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { auth } from '@/auth';

import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import Wrapper from '@/components/PageWrapper';
import Breadcrumb from '@/components/CustomBreadcrumb';
import { MessageWrapper, MessageTitle, Message, InnerWrapper } from './StyledComponents';
import Spacer from '@/components/Spacer';
import Icon from '@/components/Icon';
import NavLink from '@/components/NavLink';

export var metadata: Metadata = {
	title: 'Checkout | Vocab Builder',
};

export default async function checkoutPage() {
	let session = await auth();
	if (!session?.user) {
		redirect('/pricing');
	}

	return (
		<MaxWidthWrapper>
			<Wrapper $position='flex-start'>
				<Breadcrumb page='Pricing' link='/pricing' />
				<MessageWrapper>
					<MessageTitle>Payment Successful</MessageTitle>
					<Message>Success! Your payment is complete, and you&apos;re all set.</Message>
					<Spacer size={20} />
					<InnerWrapper>
						<Icon id='forward' size={14} />
						&nbsp;
						<NavLink href='/' $underScored={true}>
							Back to Home
						</NavLink>
					</InnerWrapper>
				</MessageWrapper>
			</Wrapper>
		</MaxWidthWrapper>
	);
}
