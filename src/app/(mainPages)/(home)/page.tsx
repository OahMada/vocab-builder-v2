import Wrapper from '@/components/PageWrapper';
import SentenceInput from '@/components/SentenceInput';
import { Title, BrowseButton } from './StyledComponents';
import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import Spacer from '@/components/Spacer';
import Icon from '@/components/Icon';

export default function Home() {
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
