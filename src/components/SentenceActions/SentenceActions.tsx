'use client';

import * as React from 'react';
import styled from 'styled-components';
import Button from '@/components/Button';
import VisuallyHidden from '@/components/VisuallyHidden';
import Icon from '@/components/Icon';

function SentenceActions() {
	return (
		<Wrapper>
			<HelpButton variant='fill'>
				<Icon id='help' size={18} />
				<VisuallyHidden>Ask Any Questions</VisuallyHidden>
			</HelpButton>
			<CancelButton variant='fill'>
				<Icon id='cancel' size={18} />
				&nbsp;Cancel
			</CancelButton>
			<Button variant='fill'>
				<Icon id='enter' size={18} />
				&nbsp;Done
			</Button>
		</Wrapper>
	);
}

export default SentenceActions;

var Wrapper = styled.div`
	display: flex;
	gap: 8px;
	width: 100%;
	justify-content: flex-end;
	/* font-size: 1.2rem; */
`;

var CancelButton = styled(Button)`
	color: var(--text-status-warning);
`;

var HelpButton = styled(Button)`
	margin-right: auto;
`;
