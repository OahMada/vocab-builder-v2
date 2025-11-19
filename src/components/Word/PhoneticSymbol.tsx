'use client';

import * as React from 'react';
import styled from 'styled-components';

import { CUSTOM_SPRING } from '@/constants';

import { MotionButton } from '@/components/Button';

function PhoneticSymbol({ symbol, ...delegated }: Omit<React.ComponentProps<typeof MotionButton>, 'variant'> & { symbol: string }) {
	return (
		<SymbolButton
			variant='outline'
			initial={{ opacity: 0, y: -2, scale: 0.5 }}
			animate={{ opacity: 1, y: 0, scale: 1 }}
			transition={CUSTOM_SPRING}
			{...delegated}
		>
			{symbol}
		</SymbolButton>
	);
}

export default PhoneticSymbol;

var SymbolButton = styled(MotionButton)`
	border-radius: 8px;
	border-style: dashed;
	padding: 3px 6px;
	font-weight: 300;

	--hover-bg-color: var(--bg-tertiary);

	&:disabled {
		color: var(--text-tertiary);
	}
`;
