'use client';

import * as React from 'react';
import styled from 'styled-components';
import Button from '@/components/Button';

function PhoneticSymbol({ word }: React.ComponentProps<'div'> & { word: string }) {
	return <SymbolButton variant='outline'>{`/${word}word/`}</SymbolButton>;
}

export default PhoneticSymbol;

var SymbolButton = styled(Button)`
	border-radius: 8px;
	font-style: italic;
	border-style: dashed;
	padding: 3px 6px;

	--hover-bg-color: var(--bg-tertiary);
`;
