import { Metadata } from 'next';
import * as React from 'react';

import Wrapper from '@/components/PageWrapper';
import MaxWidthWrapper from '@/components/MaxWidthWrapper';

export var metadata: Metadata = {
	title: 'Intro | Vocab Builder',
};

export default function IntroPage() {
	return (
		<MaxWidthWrapper>
			<Wrapper $position='flex-start'>IntroPage</Wrapper>
		</MaxWidthWrapper>
	);
}
