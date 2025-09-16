import * as React from 'react';
import { Metadata } from 'next';
import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import NotFoundRedirect, { RedirectTitle, Wrapper } from '@/components/RedirectComponents';
import Spacer from '@/components/Spacer';

export var metadata: Metadata = {
	title: 'Unauthorized | Vocab Builder',
	description: 'Unauthorized to access.',
};

function UnauthorizedDisplay() {
	return (
		<MaxWidthWrapper>
			<Wrapper>
				<RedirectTitle>401 | Unauthorized</RedirectTitle>
				<p>You are not authorized to view this page. </p>
				<Spacer size={12} />
				<NotFoundRedirect redirectUrl='/auth/login' />
			</Wrapper>
		</MaxWidthWrapper>
	);
}

export default UnauthorizedDisplay;
