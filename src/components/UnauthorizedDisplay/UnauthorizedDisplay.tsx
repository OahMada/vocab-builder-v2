import * as React from 'react';
import { Metadata } from 'next';
import Redirect, { RedirectTitle, Wrapper } from '@/components/RedirectComponents';
import Spacer from '@/components/Spacer';

export var metadata: Metadata = {
	title: 'Unauthorized | Vocab Builder',
	description: 'Unauthorized to access.',
};

function UnauthorizedDisplay({ callback, ...delegated }: { callback?: string } & React.ComponentProps<'div'>) {
	return (
		<Wrapper {...delegated}>
			<RedirectTitle>401 | Unauthorized</RedirectTitle>
			<p>You are not authorized to view this page. </p>
			<Spacer size={12} />
			<Redirect redirectUrl={`/auth/login?callback=${callback || '/'}`} />
		</Wrapper>
	);
}

export default UnauthorizedDisplay;
