import Wrapper from '@/components/PageWrapper';
import SentenceInput from '@/components/SentenceInput';
import LatestSentence from '@/components/LatestSentence';
import Title from './Title';
import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import Spacer from '@/components/Spacer';

export default function Home() {
	return (
		<MaxWidthWrapper>
			<Wrapper $position='center'>
				<Title>Vocab Builder</Title>
				<Spacer size={0} />
				<SentenceInput />
				<Spacer size={0} />
				<LatestSentence />
			</Wrapper>
		</MaxWidthWrapper>
	);
}
