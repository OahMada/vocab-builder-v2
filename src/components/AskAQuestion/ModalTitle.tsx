'use client';

import * as React from 'react';
import styled from 'styled-components';

import { Popover, PopoverTrigger, PopoverContent } from '@/components/Popover';
import Button from '@/components/Button';
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
						<Icon id='info' size={16} />
						<VisuallyHidden>Tip</VisuallyHidden>
					</InfoButton>
				</PopoverTrigger>
				<PopoverContent>
					<DescriptionText>You don&apos;t have to repeat the sentence itself. You can hit Shift + Enter to submit.</DescriptionText>
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
