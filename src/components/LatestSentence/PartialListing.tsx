'use client';

import * as React from 'react';
import styled from 'styled-components';
import DescriptionText from '@/components/DescriptionText';
import Icon from '@/components/Icon';
import Button from '@/components/Button';
import VisuallyHidden from '@/components/VisuallyHidden';
import { PopoverTrigger, PopoverContent, Popover } from '@/components/Popover';

// TODO to decide if this is useful

function PartialListing() {
	return (
		<Wrapper>
			<Heading>No Content Yet</Heading>
			<Popover>
				<PopoverTrigger asChild={true}>
					<InfoButton variant='icon'>
						<Icon id='info' size={14} />
						<VisuallyHidden>Notice</VisuallyHidden>
					</InfoButton>
				</PopoverTrigger>
				<PopoverContent>
					<DescriptionText>The sentences you recently collected would show up here.</DescriptionText>{' '}
				</PopoverContent>
			</Popover>
		</Wrapper>
	);
}

export default PartialListing;

var Wrapper = styled.div`
	background-color: var(--bg-secondary);
	color: var(--text-tertiary);
	padding: 12px;
	border-radius: 12px;
	display: flex;
	align-items: center;
	width: 100%;
	justify-content: center;
	gap: 5px;
	box-shadow: var(--shadow-elevation-low);
`;

var Heading = styled.h3`
	font-size: 1rem;
	font-weight: 400;
`;

var InfoButton = styled(Button)`
	--hover-bg-color: var(--bg-tertiary);
`;
