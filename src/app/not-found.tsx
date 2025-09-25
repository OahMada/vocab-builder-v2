import * as React from 'react';
import { Metadata } from 'next';

import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import Redirect, { RedirectTitle, Wrapper } from '@/components/RedirectComponents';
import Spacer from '@/components/Spacer';

export var metadata: Metadata = {
	title: 'Not Found | Vocab Builder',
	description: 'The page you are looking for does not exist.',
};

export default function NotFound() {
	return (
		<MaxWidthWrapper>
			<Wrapper>
				<RedirectTitle>404 | Not Found</RedirectTitle>
				<p>Could not find requested resource.</p>
				<Spacer size={12} />
				<Redirect redirectUrl='/' />
			</Wrapper>
		</MaxWidthWrapper>
	);
}
