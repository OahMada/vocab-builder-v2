'use client';

import * as React from 'react';
import styled from 'styled-components';
import { RadioGroup, RadioGroupItem } from '@/components/RadioGroup';
import Button from '@/components/Button';
import Icon from '@/components/Icon';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/Popover';
import DescriptionText from '@/components/DescriptionText';

function ChooseIPAFlavour() {
	return (
		<Wrapper>
			<Title>
				<LabelText>Set English IPA flavour</LabelText>
				<Popover>
					<PopoverTrigger asChild={true}>
						<InfoButton variant='icon'>
							<Icon id='info' size={16} />
						</InfoButton>
					</PopoverTrigger>
					<PopoverContent>
						<DescriptionText>Your can ignore this option if you are not learning English.</DescriptionText>
					</PopoverContent>
				</Popover>
			</Title>
			<RadioGroup defaultValue='UK'>
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
`;

var Title = styled.label`
	display: flex;
	gap: 5px;
	align-items: center;
`;

var LabelText = styled.span`
	font-size: 1rem;
	font-weight: 500;
`;

var InfoButton = styled(Button)`
	--hover-bg-color: var(--bg-tertiary);
`;
