'use client';

import * as React from 'react';
import styled from 'styled-components';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/Popover';
import Button from '@/components/Button';

function WordWithPhoneticSymbol({ children, symbol }: { children: string; symbol: string }) {
	return (
		<Wrapper>
			<Popover>
				<PopoverTrigger asChild={true}>
					<WordButton variant='underlined'>{children}</WordButton>
				</PopoverTrigger>
				<PopoverContent>
					<SymbolWrapper>{symbol}</SymbolWrapper>
				</PopoverContent>
			</Popover>
		</Wrapper>
	);
}

export default WordWithPhoneticSymbol;

var Wrapper = styled.span`
	display: inline-block;
`;

var WordButton = styled(Button)`
	padding-top: 4px;
	padding-bottom: 3px;
`;

var SymbolWrapper = styled.span`
	display: inline-block;
	color: var(--text-secondary);
	font-style: italic;
	padding: 3px;
	font-weight: 300;
`;
