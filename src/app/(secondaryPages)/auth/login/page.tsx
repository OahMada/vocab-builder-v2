import { Metadata } from 'next';
import * as React from 'react';

import Wrapper from '@/components/PageWrapper';
import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import Login from '@/components/Login';

export var metadata: Metadata = {
	title: 'Login | Vocab Builder',
};

export default function IntroPage() {
	return (
		<MaxWidthWrapper>
			<Wrapper $position='center'>
				<Login />
			</Wrapper>
		</MaxWidthWrapper>
	);
}
