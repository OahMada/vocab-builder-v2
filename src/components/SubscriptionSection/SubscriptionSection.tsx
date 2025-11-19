'use client';

import * as React from 'react';
import styled from 'styled-components';

import { Button } from '@/components/Button';
import DescriptionText from '@/components/DescriptionText';
import Icon from '@/components/Icon';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/Popover';
import VisuallyHidden from '@/components/VisuallyHidden';

function SubscriptionSection({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
	return (
		<Wrapper>
			<Title>
				<span>{title}</span>
				{description && (
					<Popover>
						<PopoverTrigger asChild={true}>
							<PopoverButton variant='icon'>
								<Icon id='info' size={14} />
								<VisuallyHidden>Notice</VisuallyHidden>
							</PopoverButton>
						</PopoverTrigger>
						<PopoverContent>
							<DescriptionText>{description}</DescriptionText>
						</PopoverContent>
					</Popover>
				)}
			</Title>
			{children}
		</Wrapper>
	);
}

export default SubscriptionSection;

var Wrapper = styled.section`
	padding: 12px;
	display: flex;
	flex-direction: column;
	gap: 12px;
	align-items: center;
`;

var Title = styled.h2`
	font-weight: 600;
	font-size: 1rem;
	line-height: 1;
	padding: 8px 0;
	border-bottom: 1px solid var(--border);
	display: flex;
	align-items: center;
	gap: 3px;
	position: relative;
`;

var PopoverButton = styled(Button)`
	position: absolute;
	right: -30px;
`;
