'use client';

import * as React from 'react';
import styled from 'styled-components';

import { Popover, PopoverTrigger, PopoverContent } from '@/components/Popover';
import { Button } from '@/components/Button';
import DescriptionText from '@/components/DescriptionText';
import VisuallyHidden from '@/components/VisuallyHidden';
import Icon from '@/components/Icon';

function ModalTitle({ ...delegated }) {
	return (
		<>
			<Title {...delegated}>Ask Anything</Title>
			<Popover>
				<PopoverTrigger asChild={true}>
					<InfoButton variant='icon'>
						<Icon id='info' />
						<VisuallyHidden>Tip</VisuallyHidden>
					</InfoButton>
				</PopoverTrigger>
				<PopoverContent>
					<DescriptionText>
						You don&apos;t have to repeat the sentence itself. With a keyboard, you can press Enter to submit and Shift + Enter to insert a line
						break.
					</DescriptionText>
				</PopoverContent>
			</Popover>
		</>
	);
}

var InfoButton = styled(Button)`
	--hover-bg-color: var(--bg-tertiary);
	position: relative;
	/* optical alignment */
	top: 2px;
	transform: translateY(-1px);
`;

var Title = styled.h2`
	font-size: 1.5rem;
	font-weight: 450;
	line-height: 1;
`;

export default ModalTitle;
