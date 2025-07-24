'use client';

import * as React from 'react';
import styled from 'styled-components';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/Popover';
import Button from '@/components/Button';
import DescriptionText from '@/components/DescriptionText';
import { Title } from '@/components/Modal';
import VisuallyHidden from '@/components/VisuallyHidden';
import Icon from '@/components/Icon';

function ModalTitle() {
	return (
		<Wrapper>
			<Title>Ask Anything</Title>
			<Popover>
				<PopoverTrigger asChild={true}>
					<InfoButton variant='icon'>
						<Icon id='info' size={16} />
						<VisuallyHidden>Tip</VisuallyHidden>
					</InfoButton>
				</PopoverTrigger>
				<PopoverContent
					style={
						{
							'--shadow-color': '0deg 0% 1%',
							'--shadow-elevation-medium': `0px 0.7px 0.6px hsl(var(--shadow-color) / 0.46),
              0px 1.5px 1.4px -1.3px hsl(var(--shadow-color) / 0.37),
              0px 4.4px 4px -2.7px hsl(var(--shadow-color) / 0.29),
              -0.1px 12px 10.8px -4px hsl(var(--shadow-color) / 0.2);`,
						} as React.CSSProperties
					}
				>
					<DescriptionText>You don&apos;t have to repeat the sentence itself.</DescriptionText>
				</PopoverContent>
			</Popover>
		</Wrapper>
	);
}

var Wrapper = styled.div`
	display: flex;
	align-items: baseline;
	gap: 5px;
`;

var InfoButton = styled(Button)`
	position: relative;
	/* optical alignment */
	top: 2px;
`;

export default ModalTitle;
