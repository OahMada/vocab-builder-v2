import Wrapper from './Wrapper';
import SentenceInput from '@/components/SentenceInput';
import SentencePartialListing from '@/components/SentencePartialListing';
import Title from './Title';

export default function Home() {
	return (
		<Wrapper>
			<Title>Vocab Builder</Title>
			<SentenceInput />
			<SentencePartialListing />
		</Wrapper>
	);
}
