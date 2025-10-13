import { redirect } from 'next/navigation';

import { auth } from '@/auth';

import Wrapper from '@/components/PageWrapper';
import SentenceInput from '@/components/SentenceInput';
import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import Icon from '@/components/Icon';
import { Title, BrowseButton, InnerWrapper, GroupWrapper } from './StyledComponents';

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
				<InnerWrapper>
					<Title>Vocab Builder</Title>
					<GroupWrapper>
						<SentenceInput />
						<BrowseButton variant='outline' href='/browse'>
							<Icon id='forward' />
							&nbsp;Browse
						</BrowseButton>
					</GroupWrapper>
					{/* to make sure the title and the GroupWrapper each occupy one-third of the total height */}
					<div></div>
				</InnerWrapper>
			</Wrapper>
		</MaxWidthWrapper>
	);
}
