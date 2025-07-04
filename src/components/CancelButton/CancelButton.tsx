'use client';

import * as React from 'react';
import UnstyledButton from '@/components/UnstyledButton';
import VisuallyHidden from '@/components/VisuallyHidden';
import Icon from '@/components/Icon';
import styled from 'styled-components';

function CancelButton() {
	return (
		<Wrapper>
			<Icon id='cancel' size={18} />
			<VisuallyHidden>Cancel</VisuallyHidden>
		</Wrapper>
	);
}

export default CancelButton;

var Wrapper = styled(UnstyledButton)`
	padding: 6px;
	border-radius: 12px;
	border: 1px solid var(--border-medium);
	color: var(--text-status-warning);
	@media (hover: hover) {
		&:hover {
			background-color: var(--bg-tertiary);
		}
	}
`;
