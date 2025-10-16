import { redirect } from 'next/navigation';

import { auth } from '@/auth';

import Wrapper from '@/components/PageWrapper';
import SentenceInput from '@/components/SentenceInput';
import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import Icon from '@/components/Icon';
import { Title, BrowseButton } from './StyledComponents';
import DemoNotice from '@/components/DemoNotice';

export default async function Home() {
	let session = await auth();
	// if (session?.error === 'RefreshTokenError') {
	// 	await googleLogin(); // Force sign in to obtain a new set of access and refresh tokens
	// }

	if (!session?.user) {
		redirect('/intro');
	} else if (!session.user.learningLanguage || !session.user.nativeLanguage) {
		redirect('/personalize');
	}

	return (
		<MaxWidthWrapper>
			<Wrapper $position='center'>
				<DemoNotice />
				<Title>Vocab Builder</Title>
				<SentenceInput />
				<BrowseButton variant='outline' href='/browse'>
					<Icon id='forward' />
					&nbsp;Browse
				</BrowseButton>
			</Wrapper>
		</MaxWidthWrapper>
	);
}
