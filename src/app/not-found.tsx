import * as React from 'react';
import { Metadata } from 'next';
import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import { NotFoundTitle, Wrapper } from './NotFoundStyledComponents';
import NotFoundRedirect from './NotFoundRedirect';
import Spacer from '@/components/Spacer';

export var metadata: Metadata = {
	title: 'Not Found | Vocab Builder',
	description: 'The page you are looking for does not exist.',
};

export default function NotFound() {
	return (
		<MaxWidthWrapper>
			<Wrapper>
				<NotFoundTitle>404 | Not Found</NotFoundTitle>
				<p>Could not find requested resource.</p>
				<Spacer size={12} />
				<NotFoundRedirect />
			</Wrapper>
		</MaxWidthWrapper>
	);
}
