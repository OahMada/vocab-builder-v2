import * as React from 'react';
import PartialListing from './PartialListing';
import Spacer from '@/components/Spacer';
import Wrapper from './Wrapper';
import Button from '@/components/Button';
import Icon from '@/components/Icon';

function SentencePartialListing() {
	return (
		<Wrapper>
			<Spacer size={10} />
			<PartialListing />
			<Button variant='outline'>
				<Icon id='forward' size={18} />
				&nbsp;View All
			</Button>
		</Wrapper>
	);
}

export default SentencePartialListing;
