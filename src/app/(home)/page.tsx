import Wrapper from '@/components/PageWrapper';
import SentenceInput from '@/components/SentenceInput';
import SentencePartialListing from '@/components/SentencePartialListing';
import Title from './Title';
import Spacer from '@/components/Spacer';

export default function Home() {
	return (
		<Wrapper $position='center'>
			<Title>Vocab Builder</Title>
			<Spacer size={20} />
			<SentenceInput />
			<SentencePartialListing />
		</Wrapper>
	);
}
