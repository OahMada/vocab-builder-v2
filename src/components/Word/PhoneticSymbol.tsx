'use client';

import * as React from 'react';
import styled from 'styled-components';

import Button from '@/components/Button';

function PhoneticSymbol({ symbol, ...delegated }: React.ComponentProps<'button'> & { symbol: string }) {
	return (
		<SymbolButton variant='outline' {...delegated}>
			{symbol}
		</SymbolButton>
	);
}

export default PhoneticSymbol;

var SymbolButton = styled(Button)`
	border-radius: 8px;
	border-style: dashed;
	padding: 3px 6px;
	font-weight: 300;

	--hover-bg-color: var(--bg-tertiary);
`;
