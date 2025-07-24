'use client';

import * as React from 'react';
import styled from 'styled-components';
import { Select, SelectItem } from '@/components/Select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/Popover';
import Button from '@/components/Button';
import Icon from '@/components/Icon';
import DescriptionText from '@/components/DescriptionText';

function ChooseLanguage() {
	return (
		<Wrapper>
			<Label htmlFor='language'>
				<LabelText>Set Translation Language</LabelText>
				<Popover>
					<PopoverTrigger asChild={true}>
						<InfoButton variant='icon'>
							<Icon id='info' size={16} />
						</InfoButton>
					</PopoverTrigger>
					<PopoverContent>
						<DescriptionText>
							This option corresponds to your mother language. You don&apos;t need to set which language you want to learn.{' '}
						</DescriptionText>
					</PopoverContent>
				</Popover>
			</Label>
			<Select defaultValue='Chinese' id='language'>
				<SelectItem value='Chinese'>Chinese</SelectItem>
				<SelectItem value='English'>English</SelectItem>
				<SelectItem value='French'>French</SelectItem>
				<SelectItem value='Spanish'>Spanish</SelectItem>
				<SelectItem value='German'>German</SelectItem>
			</Select>
		</Wrapper>
	);
}

export default ChooseLanguage;

var Wrapper = styled.form`
	display: flex;
	flex-direction: column;
	gap: 8px;
	align-items: center;
`;

var Label = styled.label`
	display: flex;
	gap: 5px;
	align-items: center;
`;

var LabelText = styled.span`
	font-size: 1.2rem;
	font-weight: 500;
`;

var InfoButton = styled(Button)`
	--hover-bg-color: var(--bg-tertiary);
	/* optical alignment */
	position: relative;
	top: 1px;
`;
