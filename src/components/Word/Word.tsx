'use client';

import * as React from 'react';
import styled from 'styled-components';
import Button from '@/components/Button';
import PhoneticSymbol from './PhoneticSymbol';

type WordProps = React.ComponentProps<'span'> & { segment: string; isWord: boolean | undefined };

function Word({ segment, isWord }: WordProps) {
	let [hasSymbol, setHasSymbol] = React.useState(() => segment === 'temps');

	if (segment === ' ') {
		return undefined;
	}

	return isWord ? (
		<Wrapper>
			{hasSymbol ? <InactiveWordButton>{segment}</InactiveWordButton> : <WordButton variant='fill'>{segment}</WordButton>}
			{hasSymbol && <PhoneticSymbol word={segment} />}
		</Wrapper>
	) : (
		segment
	);
}

export default Word;

var Wrapper = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: baseline;
	gap: 5px;
`;

var WordButton = styled(Button)`
	padding: 3px 6px;
	border-radius: 12px;
`;

var InactiveWordButton = styled.span`
	display: inline-block;
	padding: 4px;
	border-bottom: 1px dashed var(--border-medium);
`;
