'use client';

import * as React from 'react';
import styled from 'styled-components';

import { Select, SelectItem } from '@/components/Select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/Popover';
import Button from '@/components/Button';
import Icon from '@/components/Icon';
import DescriptionText from '@/components/DescriptionText';
import VisuallyHidden from '@/components/VisuallyHidden';

var LanguageMap = {
	learning: {
		labelText: 'Set Learning Language',
		desc: 'the language you are learning',
	},
	translation: {
		labelText: 'Set Transition Language',
		desc: 'your native language',
	},
} as const;

function ChooseLanguage({ type, ...delegated }: { type: 'learning' | 'translation' } & Omit<React.ComponentProps<typeof Select>, 'id'>) {
	let { labelText, desc } = LanguageMap[type];

	return (
		<Wrapper>
			<Label htmlFor='language'>
				<LabelText>{labelText}</LabelText>
				<Popover>
					<PopoverTrigger asChild={true}>
						<InfoButton variant='icon'>
							<Icon id='info' size={16} />
							<VisuallyHidden>Notice</VisuallyHidden>
						</InfoButton>
					</PopoverTrigger>
					<PopoverContent>
						<DescriptionText>This option corresponds to {desc}.</DescriptionText>
					</PopoverContent>
				</Popover>
			</Label>
			<Select id='language' {...delegated}>
				{type === 'translation' && <SelectItem value='Chinese'>Chinese</SelectItem>}
				<SelectItem value='English'>English</SelectItem>
				<SelectItem value='French'>French</SelectItem>
				<SelectItem value='Spanish'>Spanish</SelectItem>
				<SelectItem value='German'>German</SelectItem>
			</Select>
		</Wrapper>
	);
}

export default ChooseLanguage;

var Wrapper = styled.div`
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
	font-weight: 500;
	user-select: none;
`;

var InfoButton = styled(Button)`
	--hover-bg-color: var(--bg-tertiary);
`;
