'use client';

import * as React from 'react';
import styled from 'styled-components';
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
			<ViewAllButton variant='outline' href='/browse'>
				<Icon id='forward' />
				&nbsp;View All
			</ViewAllButton>
		</Wrapper>
	);
}

export default SentencePartialListing;

var ViewAllButton = styled(Button)`
	@media (hover: hover) {
		&:hover {
			text-decoration: none;
		}
	}
`;
