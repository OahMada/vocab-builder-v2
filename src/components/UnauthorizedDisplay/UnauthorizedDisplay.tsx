import * as React from 'react';
import { Metadata } from 'next';
import NotFoundRedirect, { RedirectTitle, Wrapper } from '@/components/RedirectComponents';
import Spacer from '@/components/Spacer';

export var metadata: Metadata = {
	title: 'Unauthorized | Vocab Builder',
	description: 'Unauthorized to access.',
};

function UnauthorizedDisplay() {
	return (
		<Wrapper>
			<RedirectTitle>401 | Unauthorized</RedirectTitle>
			<p>You are not authorized to view this page. </p>
			<Spacer size={12} />
			<NotFoundRedirect redirectUrl='/auth/login' />
		</Wrapper>
	);
}

export default UnauthorizedDisplay;
