import { redirect } from 'next/navigation';

import { auth } from '@/auth';

import Wrapper from '@/components/PageWrapper';
import SentenceInput from '@/components/SentenceInput';
import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import Spacer from '@/components/Spacer';
import Icon from '@/components/Icon';
import { Title, BrowseButton } from './StyledComponents';

export default async function Home() {
	let session = await auth();
	if (!session?.user) {
		redirect('/intro');
	} else if (!session.user.learningLanguage || !session.user.nativeLanguage) {
		redirect('/personalize');
	}

	return (
		<MaxWidthWrapper>
			<Wrapper $position='center'>
				<Title>Vocab Builder</Title>
				<Spacer size={0} />
				<SentenceInput />
				<Spacer size={0} />
				<BrowseButton variant='outline' href='/browse'>
					<Icon id='forward' />
					&nbsp;Browse
				</BrowseButton>
			</Wrapper>
		</MaxWidthWrapper>
	);
}
