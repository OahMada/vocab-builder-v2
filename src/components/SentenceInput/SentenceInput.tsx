import * as React from 'react';
import Textarea from '@/components/Textarea';
import ActionButtons from './ActionButtons';
import Wrapper from './Wrapper';
import Spacer from '@/components/Spacer';

function SentenceInput() {
	return (
		<Wrapper>
			<Spacer size={4} />
			<Textarea placeholder='Enter or paste in a sentence.' />
			<ActionButtons />
		</Wrapper>
	);
}

export default SentenceInput;
