import * as React from 'react';
import TextArea from '@/components/TextArea';
import ActionButtons from './ActionButtons';
import Wrapper from './Wrapper';

function SentenceInput() {
	return (
		<Wrapper>
			<TextArea placeholder='Enter or paste in a sentence.' />
			<ActionButtons />
		</Wrapper>
	);
}

export default SentenceInput;
