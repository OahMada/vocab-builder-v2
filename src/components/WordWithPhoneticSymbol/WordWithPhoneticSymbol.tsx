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
					<WordButton variant='icon'>{children}</WordButton>
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
	--hover-bg-color: var(--bg-tertiary);
	padding: 4px 2px 2px;
	border-bottom: 2px dashed var(--border-medium);
	line-height: 1;
	border-radius: 4px;
	color: inherit;
`;

var SymbolWrapper = styled.span`
	display: block;
	padding: 3px;
	font-weight: 300;
	user-select: none;
`;
