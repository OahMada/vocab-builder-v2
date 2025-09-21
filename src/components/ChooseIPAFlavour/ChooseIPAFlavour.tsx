'use client';

import * as React from 'react';
import styled from 'styled-components';
import { RadioGroup, RadioGroupItem } from '@/components/RadioGroup';
import Button from '@/components/Button';
import Icon from '@/components/Icon';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/Popover';
import DescriptionText from '@/components/DescriptionText';
import VisuallyHidden from '@/components/VisuallyHidden';

function ChooseIPAFlavour({ ...delegated }: React.ComponentProps<typeof RadioGroup>) {
	return (
		<Wrapper>
			<Title>
				<LabelText>Set English IPA flavour</LabelText>
				<Popover>
					<PopoverTrigger asChild={true}>
						<InfoButton variant='icon'>
							<Icon id='info' size={16} />
							<VisuallyHidden>Notice</VisuallyHidden>
						</InfoButton>
					</PopoverTrigger>
					<PopoverContent>
						<DescriptionText>Your can ignore this option if you are not learning English.</DescriptionText>
					</PopoverContent>
				</Popover>
			</Title>
			<RadioGroup defaultValue='UK' {...delegated}>
				<RadioGroupItem value='UK' />
				<RadioGroupItem value='US' />
			</RadioGroup>
		</Wrapper>
	);
}

export default ChooseIPAFlavour;

var Wrapper = styled.div`
	display: flex;
	flex-direction: column;
	gap: 8px;
	align-items: center;
`;

var Title = styled.div`
	display: flex;
	gap: 5px;
	align-items: center;
`;

var LabelText = styled.span`
	font-weight: 500;
	user-select: none;
`;

var InfoButton = styled(Button)`
	--hover-bg-color: var(--bg-tertiary);
`;
