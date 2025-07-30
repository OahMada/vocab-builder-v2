import * as React from 'react';
import PartialListing from './PartialListing';
import Spacer from '@/components/Spacer';
import Wrapper from './Wrapper';
import Button from '@/components/Button';
import Icon from '@/components/Icon';

// TODO view all button only shows up when there's at least two

function SentencePartialListing() {
	return (
		<Wrapper>
			<Spacer size={10} />
			<PartialListing />
			<Button variant='outline' href='/browse'>
				<Icon id='forward' />
				&nbsp;View All
			</Button>
		</Wrapper>
	);
}

export default SentencePartialListing;
